import type { ElementType } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { duration, ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Kinetic headline animator. Splits text per word or per character and reveals
 * each unit on a stagger from behind a mask. Accessible: the real text is
 * exposed via aria-label while the animated units are aria-hidden.
 */
export function SplitText({
  text,
  as,
  splitBy = "word",
  stagger = 0.045,
  delay = 0,
  className,
}: {
  text: string;
  as?: ElementType;
  splitBy?: "word" | "char";
  stagger?: number;
  delay?: number;
  className?: string;
}) {
  const Tag = as ?? "span";
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const unit: Variants = {
    hidden: { y: "110%", opacity: 0, rotateX: 45 },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      transition: { duration: duration.slow, ease: ease.entrance },
    },
  };

  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="inline"
        style={{ perspective: 800 }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
      >
        {words.map((word, wi) => (
          <span
            key={wi}
            className="mr-[0.25em] inline-block overflow-hidden align-bottom"
          >
            {splitBy === "char" ? (
              word.split("").map((char, ci) => (
                <motion.span key={ci} className="inline-block" variants={unit}>
                  {char}
                </motion.span>
              ))
            ) : (
              <motion.span className="inline-block" variants={unit}>
                {word}
              </motion.span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
