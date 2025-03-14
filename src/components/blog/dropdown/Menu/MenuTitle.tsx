import { styled } from "styled-components";
import React from "react";

type MenuTitleProps = {
  children: React.ReactNode;
};

export const MenuTitle = (props: MenuTitleProps) => {
  const { children, ...rest } = props;

  return <Root {...rest}>{children}</Root>;
};

const Root = styled.span`
  font-size: 12px;
  flex-grow: 1;
  min-width: 70px;
`;
