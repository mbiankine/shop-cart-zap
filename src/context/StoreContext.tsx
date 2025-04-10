
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  whatsappNumber: string;
}

type StoreAction = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'SET_WHATSAPP_NUMBER'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: StoreState = {
  cart: [],
  whatsappNumber: ''
};

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += 1;
        return { ...state, cart: updatedCart };
      }
      
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id)
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        cart: state.cart.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      };
    }

    case 'SET_WHATSAPP_NUMBER':
      return {
        ...state,
        whatsappNumber: action.payload
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };

    default:
      return state;
  }
};

interface StoreContextType {
  state: StoreState;
  dispatch: Dispatch<StoreAction>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
