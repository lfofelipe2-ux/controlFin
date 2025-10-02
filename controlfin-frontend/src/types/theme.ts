/**
 * Theme Types for BlockAI Design System
 *
 * This file contains TypeScript type definitions for the BlockAI theme
 * and related design system components.
 */

export interface BlockAIColors {
  // Background Colors
  backgroundPrimary: string; // #2d3561
  backgroundCards: string; // #363d65
  backgroundSidebar: string; // #1f2347

  // Accent Colors
  accentPrimary: string; // #00d9ff
  accentSecondary: string; // #2196f3

  // Text Colors
  textPrimary: string; // #ffffff
  textSecondary: string; // #a0a4b8

  // Status Colors
  success: string; // #00ff88
  error: string; // #ff3366
  warning: string; // #ffaa00
}

export interface BlockAITypography {
  fontFamily: string;
  weights: {
    light: number; // 300
    regular: number; // 400
    semibold: number; // 600
  };
  sizes: {
    mobile: {
      h1: string;
      h2: string;
      body: string;
      small: string;
      caption: string;
    };
    tablet: {
      h1: string;
      h2: string;
      body: string;
      small: string;
      caption: string;
    };
    desktop: {
      h1: string;
      h2: string;
      body: string;
      small: string;
      caption: string;
    };
  };
}

export interface BlockAISpacing {
  mobile: {
    xs: string; // 4px
    sm: string; // 8px
    md: string; // 16px
    lg: string; // 24px
    xl: string; // 32px
  };
  tablet: {
    xs: string; // 6px
    sm: string; // 12px
    md: string; // 24px
    lg: string; // 32px
    xl: string; // 48px
  };
  desktop: {
    xs: string; // 8px
    sm: string; // 16px
    md: string; // 32px
    lg: string; // 48px
    xl: string; // 64px
  };
}

export interface BlockAIBreakpoints {
  xs: string; // 320px - Mobile portrait
  sm: string; // 576px - Mobile landscape
  md: string; // 768px - Tablet portrait
  lg: string; // 1024px - Desktop
  xl: string; // 1200px - Large desktop
  xxl: string; // 1920px - Extra large
}

export interface BlockAIComponents {
  buttons: {
    primary: {
      background: string;
      color: string;
      border: string;
    };
    outline: {
      background: string;
      color: string;
      border: string;
    };
  };
  inputs: {
    background: string;
    border: string;
    focusGlow: string;
  };
  cards: {
    background: string;
    borderRadius: string;
    boxShadow: string;
  };
  icons: {
    style: string;
    color: string;
  };
  badges: {
    borderRadius: string;
    colors: string[];
  };
}

export interface BlockAIDesignSystem {
  colors: BlockAIColors;
  typography: BlockAITypography;
  spacing: BlockAISpacing;
  breakpoints: BlockAIBreakpoints;
  components: BlockAIComponents;
}

// Export the complete design system configuration
export const blockAIDesignSystem: BlockAIDesignSystem = {
  colors: {
    backgroundPrimary: '#2d3561',
    backgroundCards: '#363d65',
    backgroundSidebar: '#1f2347',
    accentPrimary: '#00d9ff',
    accentSecondary: '#2196f3',
    textPrimary: '#ffffff',
    textSecondary: '#a0a4b8',
    success: '#00ff88',
    error: '#ff3366',
    warning: '#ffaa00',
  },

  typography: {
    fontFamily: 'Inter, Poppins, Roboto, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      semibold: 600,
    },
    sizes: {
      mobile: {
        h1: '24px',
        h2: '20px',
        body: '16px',
        small: '14px',
        caption: '12px',
      },
      tablet: {
        h1: '28px',
        h2: '24px',
        body: '16px',
        small: '14px',
        caption: '12px',
      },
      desktop: {
        h1: '32px',
        h2: '28px',
        body: '16px',
        small: '14px',
        caption: '12px',
      },
    },
  },

  spacing: {
    mobile: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    tablet: {
      xs: '6px',
      sm: '12px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
    desktop: {
      xs: '8px',
      sm: '16px',
      md: '32px',
      lg: '48px',
      xl: '64px',
    },
  },

  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    xxl: '1920px',
  },

  components: {
    buttons: {
      primary: {
        background: '#00d9ff',
        color: '#ffffff',
        border: 'none',
      },
      outline: {
        background: 'transparent',
        color: '#00d9ff',
        border: '1px solid #00d9ff',
      },
    },
    inputs: {
      background: '#363d65',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      focusGlow: '0 0 0 2px rgba(0, 217, 255, 0.2)',
    },
    cards: {
      background: '#363d65',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    icons: {
      style: 'outline',
      color: '#a0a4b8',
    },
    badges: {
      borderRadius: '16px',
      colors: ['#00ff88', '#ff3366', '#ffaa00'],
    },
  },
};

export default blockAIDesignSystem;
