import { type RefObject, useLayoutEffect, useRef, useState } from "react";
import { Menu, type MenuConfig } from "../Menu";
import { useMenuPosition } from "../useMenuPosition";

type ChildrenProps = { ref: RefObject<any>; onClick: () => void };

type DropdownProps = {
  config: MenuConfig;
  children: (props: ChildrenProps) => React.ReactNode;
  Menu?: JSX.ElementType;
  MenuBody?: JSX.ElementType;
};

export const Dropdown = (props: DropdownProps) => {
  const { config, children, Menu: MenuComponent, MenuBody } = props;
  const [rect, setRect] = useState<DOMRect>();
  const [isOpen, setOpen] = useState(false);

  const ref = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLMenuElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setRect(rect);
    }
  }, [isOpen]);

  const coords = {
    x: rect?.left ?? 0,
    y: (rect?.top ?? 0) + (rect?.height ?? 0),
  };

  const [transform, newCoords] = useMenuPosition(coords, (context) => {
    const [horizontal, vertical] = context.helpers.isWithinWindow();

    if (!vertical) {
      context.flip([false, true]).move(0, -(rect?.height ?? 0));
    }

    if (!horizontal) {
      context.flip([true, false]).move(rect?.width ?? 0, 0);
    }

    return context.point;
  });

  useLayoutEffect(() => {
    if (menuRef.current) {
      transform(menuRef.current);
    }
  }, [isOpen, rect?.top, rect?.left]);

  const handleClick = () => {
    setOpen((isOpen) => !isOpen);
  };

  const handleToggle = (value?: boolean) => {
    setOpen((isOpen) => (value === undefined ? !isOpen : value));
  };

  return (
    <>
      {children({ ref, onClick: handleClick })}
      <Menu
        ref={menuRef}
        Menu={MenuComponent}
        MenuBody={MenuBody}
        coords={[newCoords.x, newCoords.y]}
        isOpen={isOpen}
        config={config}
        onToggle={handleToggle}
      />
    </>
  );
};
