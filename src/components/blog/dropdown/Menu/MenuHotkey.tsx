import { styled } from "styled-components";
import React from "react";

type MenuTitleProps = {
  children: React.ReactNode;
};

export const MenuHotkey = (props: MenuTitleProps) => {
  const { children, ...rest } = props;

  return <Root {...rest}>{children}</Root>;
};

const Root = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 20px;
  font-size: 12px;
`;
