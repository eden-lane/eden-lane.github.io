"use client";

import React, { forwardRef, Ref, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useTransition, animated, useSpring } from "@react-spring/web";
import styles from "./Block.module.css";

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  style: any;
}

export const Block = forwardRef(function Block(props: Props, ref: Ref<HTMLDivElement>) {
    const { className, children, onClick, style } = props;

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
