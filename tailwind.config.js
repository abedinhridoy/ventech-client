module.exports = {
  // ...existing config...
  theme: {
    extend: {
      // ...other extensions...
      animation: {
        'loading-bar': 'loading 1.5s infinite',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
    },
  },
  // ...rest of config...
}