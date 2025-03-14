import { styled } from "styled-components";
import React from "react";

type MenuIconProps = {
  children?: React.ReactNode;
};

export const MenuIcon = (props: MenuIconProps) => {
  const { children } = props;

  return (
    <Root>
      {children}
    </Root>
  )
}

const Root = styled.span`
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
`;
