import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import clsx from "clsx";

function LoanTypeCard({
  icon,
  title,
  description,
  selected,
  badge,
  onClick,
}) {
  return (
    <motion.button
      type="button"
      layout
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={clsx(
        "loan-type-card",
        selected && "loan-type-card-selected"
      )}
    >
      <div className="loan-type-card-top">
        <div className="loan-type-icon">
          {icon}
        </div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key="selected"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="loan-type-radio loan-type-radio-selected"
            >
              <Check
                size={13}
                strokeWidth={3}
              />
            </motion.div>
          ) : (
            <motion.div
              key="unselected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="loan-type-radio"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="loan-type-card-content">
        {badge && (
          <div className="loan-type-badge">
            <span>★</span>
            {badge}
          </div>
        )}

        <h3 className="loan-type-title">
          {title}
        </h3>

        <p className="loan-type-description">
          {description}
        </p>
      </div>
    </motion.button>
  );
}

export default LoanTypeCard;