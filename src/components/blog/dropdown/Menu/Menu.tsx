import {
  forwardRef,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { styled, keyframes } from "styled-components";
import { createPortal } from "react-dom";
import { MenuItem } from "./MenuItem";
import { MenuIcon } from "./MenuIcon";
import { MenuTitle } from "./MenuTitle";
import { MenuHotkey } from "./MenuHotkey";
import { MenuDelimiter } from "./MenuDelimiter";
import { useMenuPosition } from "../useMenuPosition";
import type { MenuConfig } from "./types";
import { SafeSpace } from "./SafeSpace";
import { useMergeRefs } from "../useMergeRefs";
import ChevronRightIcon from "../icons/chevron-right.svg";

type Coords = [number, number];

type MenuProps = {
  config: MenuConfig;
  className?: string;
  isOpen?: boolean;
  coords: Coords;
  onToggle?: (isOpen?: boolean) => void;
  Menu?: JSX.ElementType;
  MenuBody?: JSX.ElementType;
};

/**
 * Component for rendering various types of menus.
 *
 */
export const MenuComponent = forwardRef<HTMLMenuElement, MenuProps>(
  (props, menuRef) => {
    const {
      isOpen,
      className,
      coords,
      config,
      Menu: MenuRootComponent,
      MenuBody,
      onToggle,
    } = props;
    const ref = useRef<HTMLMenuElement>(null);

    const mergedRef = useMergeRefs([menuRef, ref]);

    const refs = useRef<Record<string, HTMLLIElement>>({});

    const [rects, setRects] = useState<Record<string, DOMRect>>({});
    const [selected, setSelected] = useState<Array<number>>([]);

    const isSelected = (index: number, level: number) => {
      return selected[level] === index;
    };

    const getConfig = (path: number[], level: number) => {
      return path
        .slice(0, level + 1)
        .reduce<MenuConfig | null>((prev, current) => {
          return (prev || config).items?.[current]?.config || null;
        }, null);
    };

    const getCurrentConfig = (path: number[]) => {
      if (path.length === 1) {
        return config;
      }

      return path.reduce<MenuConfig | null>((prev = config, current) => {
        const currentConfig = prev || config;
        return currentConfig.items?.[current]?.config || prev;
      }, null);
    };

    const updateRect = (path: number[]) => {
      const rect = refs.current[path.join(",")]?.getBoundingClientRect();
      setRects({
        ...rects,
        [path.join(",")]: rect,
      });
    };

    useLayoutEffect(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setRects({ "@": rect });
      }
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        const firstSelectable = config.items?.findIndex(
          (item) => item.selectable ?? true,
        );
        if (firstSelectable !== undefined) {
          setSelected([firstSelectable]);
        }
      }
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        const handleKeyDown = (event: KeyboardEvent) => {
          const currentConfig = getCurrentConfig(selected);

          switch (event.key) {
            case "ArrowDown": {
              const firstSelectableIndex =
                currentConfig?.items?.findIndex(
                  (item) => item.selectable ?? true,
                ) ?? -1;
              const nextSelectableIndex = currentConfig?.items?.findIndex(
                (item, index) => {
                  return (
                    (item.selectable ?? true) &&
                    index > selected[selected.length - 1]
                  );
                },
              );

              if (nextSelectableIndex) {
                setSelected((selected) => {
                  const newSelected = [
                    ...selected.slice(0, selected.length - 1),
                    nextSelectableIndex === -1
                      ? firstSelectableIndex
                      : nextSelectableIndex,
                  ];
                  updateRect(newSelected);
                  refs.current[newSelected.join(",")].scrollIntoView({
                    block: "nearest",
                  });

                  return newSelected;
                });
              }
              event.preventDefault();
              event.stopPropagation();
              break;
            }
            case "ArrowUp": {
              if (!currentConfig?.items?.length) {
                return;
              }

              const lastSelectableIndex = currentConfig?.items?.reduce(
                (acc, item, index) => {
                  return (item.selectable ?? true) ? index : acc;
                },
                -1,
              );

              const prevSelectableIndex = currentConfig?.items
                ?.slice(0, selected[selected.length - 1])
                .reverse()
                .findIndex((item) => item.selectable ?? true);

              const newSelected = [
                ...selected.slice(0, selected.length - 1),
                prevSelectableIndex === -1
                  ? lastSelectableIndex
                  : selected[selected.length - 1] - prevSelectableIndex - 1,
              ];

              setSelected(() => {
                updateRect(newSelected);
                refs.current[newSelected.join(",")].scrollIntoView({
                  block: "nearest",
                });

                return newSelected;
              });

              event.preventDefault();
              event.stopPropagation();
              break;
            }
            case "ArrowRight": {
              const currentItem =
                currentConfig?.items?.[selected[selected.length - 1]];

              if (currentItem?.config?.items) {
                const firstSelectableIndex = currentConfig?.items?.findIndex(
                  (item) => item.selectable ?? true,
                );
                if (firstSelectableIndex !== undefined) {
                  setSelected((selected) => {
                    const newSelected = [...selected, firstSelectableIndex];
                    updateRect(newSelected);

                    return newSelected;
                  });
                }
                currentItem.config?.onFocus?.();
              }
              event.preventDefault();
              event.stopPropagation();
              break;
            }
            case "ArrowLeft": {
              setSelected((selected) => {
                return selected.slice(0, selected.length - 1);
              });
              event.preventDefault();
              event.stopPropagation();
              break;
            }
            case "Escape": {
              onToggle?.(false);
              event.preventDefault();
              event.stopPropagation();
              break;
            }
            case "Enter": {
              const currentItem =
                currentConfig?.items?.[selected[selected.length - 1]];
              if (currentItem?.onSelect) {
                currentItem.onSelect();
              }
              onToggle?.(false);
              event.preventDefault();
              event.stopPropagation();
              break;
            }
            case " ": {
              const currentItem =
                currentConfig?.items?.[selected[selected.length - 1]];
              if (currentItem?.onSelect) {
                currentItem.onSelect();
              }
              event.preventDefault();
              event.stopPropagation();
              break;
            }
          }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
          document.removeEventListener("keydown", handleKeyDown);
        };
      }
    }, [isOpen, selected]);

    const renderSubMenu = (): ReactNode => {
      return selected.map((_, selectedIndex) => {
        const config = getConfig(selected, selectedIndex);
        const items = config?.items;

        const path = selected.slice(0, selectedIndex + 1).join(",");
        const rect = rects[path];

        if (!rect || !items) {
          return null;
        }

        const coords = [rect.left + rect.width, rect.top] as Coords;

        return createPortal(
          <InnerMenu
            key={path}
            rect={rect}
            coords={coords}
            Menu={MenuRootComponent}
            MenuBody={MenuBody}
          >
            {config?.header && config.header()}
            <Scrollable>
              {items.map((item, index) => (
                <MenuItem
                  key={index}
                  ref={(element) => {
                    if (element && (item.selectable ?? true)) {
                      const selectedPath = [
                        ...selected.slice(0, selectedIndex + 1),
                        index,
                      ];
                      refs.current[selectedPath.join(",")] = element;
                    }
                  }}
                  selectable={item.selectable}
                  isSelected={isSelected(index, selectedIndex + 1)}
                  onMouseEnter={(event) => {
                    if (item.selectable ?? true) {
                      const selectedPath = [
                        ...selected.slice(0, selectedIndex + 1),
                        index,
                      ];
                      const rect = event.currentTarget.getBoundingClientRect();

                      setSelected(selectedPath);
                      setRects((rects) => ({
                        ...rects,
                        [selectedPath.join(",")]: rect,
                      }));
                    }
                  }}
                  onClick={() => item.onSelect?.()}
                >
                  {item.render()}
                  {item.config?.items && (
                    <img src={ChevronRightIcon.src} width={16} height={16} />
                  )}
                </MenuItem>
              ))}
            </Scrollable>
            {config?.footer && config.footer()}
          </InnerMenu>,
          document.body,
        );
      });
    };

    if (!isOpen) {
      return null;
    }

    return (
      <>
        {createPortal(
          <>
            <InnerMenu
              className={className}
              ref={mergedRef}
              coords={coords}
              rect={rects["@"]}
              Menu={MenuRootComponent}
              MenuBody={MenuBody}
              root
            >
              {config?.header && config.header()}
              <Scrollable>
                {config.items?.map((item, index) => (
                  <MenuItem
                    key={index}
                    ref={(element) => {
                      if (element && (item.selectable ?? true)) {
                        refs.current[index] = element;
                      }
                    }}
                    selectable={item.selectable}
                    isSelected={isSelected(index, 0)}
                    onMouseEnter={(event) => {
                      if (item.selectable ?? true) {
                        const rect =
                          event.currentTarget.getBoundingClientRect();

                        setSelected([index]);
                        setRects((rects) => ({
                          ...rects,
                          [index]: rect,
                        }));
                      }
                    }}
                    onClick={() => {
                      const autoClose = item.autoClose ?? true;
                      autoClose && onToggle?.(false);
                      item.onSelect?.();
                    }}
                  >
                    {item.render()}
                    {item.config?.items && (
                      <img src={ChevronRightIcon.src} width={16} height={16} />
                    )}
                  </MenuItem>
                ))}
              </Scrollable>
              {config?.footer && config.footer()}
            </InnerMenu>
            <Backdrop onClick={() => onToggle?.(false)} />
          </>,
          document.body,
        )}
        {renderSubMenu()}
      </>
    );
  },
);

type InnerMenuProps = {
  rect: DOMRect;
  children: React.ReactNode;
  className?: string;
  coords: Coords;
  root?: boolean;
  Menu?: JSX.ElementType;
  MenuBody?: JSX.ElementType;
};

const InnerMenu = forwardRef<HTMLMenuElement, InnerMenuProps>((props, ref) => {
  const {
    root,
    className,
    coords,
    rect,
    children,
    Menu: MenuRootComponent = Root,
    MenuBody: MenuBodyComponent = MenuBody,
  } = props;

  const [itemRect, setItemRect] = useState<DOMRect>();
  const itemRef = useRef<HTMLDivElement>(null);

  const [transform, newCoords] = useMenuPosition(
    {
      x: coords[0],
      y: coords[1],
    },
    (context) => {
      const [horizontal, vertical] = context.helpers.isWithinWindow();

      if (root) {
        return context.point;
      }

      if (!rect) {
        return context.point;
      }

      if (!horizontal) {
        context.flip([true, false]).move(-rect?.width, 0).move(-4, 0);
      }

      if (!vertical) {
        context.flip([false, true]).move(0, rect?.height).move(0, -4);
      }

      return context.point;
    },
  );

  useLayoutEffect(() => {
    if (itemRef.current && !root) {
      transform(itemRef.current);
    }
  }, []);

  useEffect(() => {
    if (itemRef.current) {
      setItemRect(itemRef.current.getBoundingClientRect());
    }
  }, [newCoords]);

  return (
    <>
      {!root && <SafeSpace rect={itemRect} />}
      <MenuRootComponent
        className={className}
        ref={ref}
        coords={root ? coords : [newCoords.x, newCoords.y]}
      >
        <MenuBodyComponent ref={itemRef}>{children}</MenuBodyComponent>
      </MenuRootComponent>
    </>
  );
});

InnerMenu.displayName = "InnerMenu";

export const Menu = MenuComponent as typeof MenuComponent & {
  Root: typeof Root;
  Body: typeof MenuBody;
  Item: typeof MenuItem;
  Icon: typeof MenuIcon;
  Title: typeof MenuTitle;
  Hotkey: typeof MenuHotkey;
  Delimiter: typeof MenuDelimiter;
};

const animation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Root = styled.menu<{ coords: Coords }>`
  background-color: #fff;
  overflow: hidden;
  position: absolute;
  padding: 4px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0;
  box-sizing: border-box;
  left: ${(p) => p.coords[0]}px;
  top: ${(p) => p.coords[1]}px;
  z-index: 2;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  animation: ${animation} 200ms ease-in;
`;

const MenuBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Scrollable = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
`;

Menu.Root = Root;
Menu.Body = MenuBody;
Menu.Item = MenuItem;
Menu.Icon = MenuIcon;
Menu.Title = MenuTitle;
Menu.Hotkey = MenuHotkey;
Menu.Delimiter = MenuDelimiter;
