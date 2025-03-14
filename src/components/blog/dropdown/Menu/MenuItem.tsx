import { styled } from "styled-components";
import React, { forwardRef } from 'react';

type MenuItemProps = {
  children: React.ReactNode;
  selectable?: boolean;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLLIElement>;

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => {
  const { children, selectable = true, isSelected, ...rest } = props;

  return (
    <Root ref={ref} selectable={selectable} {...rest}>
      <Content isSelected={isSelected}>{children}</Content>
    </Root>
  );
});

const Root = styled.li<{ selectable: boolean }>`
  list-style: none;
  cursor: ${(p) => (p.selectable ? 'pointer' : 'default')};
  padding: 0 4px;
  margin: 0;
  border-radius: 4px;
`;

const Content = styled.div<{ isSelected?: boolean; danger?: boolean }>`
  border-radius: 4px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${(p) => p.isSelected && 'rgba(0, 0, 0, 0.05)'};
`;
