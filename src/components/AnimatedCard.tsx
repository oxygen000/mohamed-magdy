import React from "react";
import { motion } from "framer-motion";
import { Paper, PaperProps } from "@mui/material";

interface AnimatedCardProps extends PaperProps {
  delay?: number;
  duration?: number;
  animation?:
    | "fade"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "rotate";
  hover?: boolean;
  children: React.ReactNode;
}

const animations = {
  fade: {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: { delay, duration: 0.5 },
    }),
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay, duration: 0.5, type: "spring", stiffness: 100 },
    }),
  },
  slideLeft: {
    hidden: { x: 50, opacity: 0 },
    visible: (delay: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay, duration: 0.5, type: "spring", stiffness: 100 },
    }),
  },
  slideRight: {
    hidden: { x: -50, opacity: 0 },
    visible: (delay: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay, duration: 0.5, type: "spring", stiffness: 100 },
    }),
  },
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (delay: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay, duration: 0.5 },
    }),
  },
  rotate: {
    hidden: { rotate: -5, opacity: 0 },
    visible: (delay: number) => ({
      rotate: 0,
      opacity: 1,
      transition: { delay, duration: 0.5 },
    }),
  },
};

const hoverEffects = {
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 },
  },
};

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  delay = 0,
  duration = 0.5,
  animation = "fade",
  hover = false,
  children,
  ...rest
}) => {
  const animationVariant = animations[animation];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={hover ? "hover" : undefined}
      variants={
        hover ? { ...animationVariant, ...hoverEffects } : animationVariant
      }
    >
      <Paper
        elevation={2}
        {...rest}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: "100%",
          ...rest.sx,
        }}
      >
        {children}
      </Paper>
    </motion.div>
  );
};

export default AnimatedCard;
