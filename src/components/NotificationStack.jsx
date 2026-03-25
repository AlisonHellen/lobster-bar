import { useBarStore } from '../store/barStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationStack() {
  const { notifications } = useBarStore()

  return (
    <div style={{
      position: 'fixed', top: 80, right: 16, zIndex: 999,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            style={{
              background: 'linear-gradient(135deg, #2C1810, #3D1A0A)',
              border: '1px solid rgba(255,215,0,0.5)',
              borderRadius: 10, padding: '12px 16px',
              maxWidth: 280, color: '#FFD700',
              fontSize: 13, fontWeight: 500,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {n.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
