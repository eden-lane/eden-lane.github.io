"use client";

import React, { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useTransition, animated, useSpring } from "@react-spring/web";
import styles from "./Block.module.css";

type Props = {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick?: () => void;
  style: any;
}

export const Block: React.FC<Props> = forwardRef((props, ref) => {
    const { isOpen, className, children, onClick, style } = props;

    return (
      <>
        <animated.div
          ref={ref}
          onClick={onClick}
          className={clsx(styles.block, className)}
          style={style}
        >
          {children}
        </animated.div>
      </>
    );
  })
;
