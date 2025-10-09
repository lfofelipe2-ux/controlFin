import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService, i18nService } from '../i18n.service';
import { FastifyRequest } from 'fastify';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    service = new I18nService();
  });

  describe('getMessage', () => {
    it('should return English message by default', () => {
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Field {field} is required');
    });

    it('should return Portuguese message when language is set to pt', () => {
      service.setLanguage('pt');
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Campo {field} é obrigatório');
    });

    it('should interpolate parameters correctly', () => {
      const message = service.getMessage('errors.validation.required', { field: 'email' });
      expect(message).toBe('Field email is required');
    });

    it('should interpolate multiple parameters', () => {
      const message = service.getMessage('errors.validation.min', { 
        field: 'age', 
        min: '18' 
      });
      expect(message).toBe('Field age must be at least 18');
    });

    it('should return key when translation not found', () => {
      const message = service.getMessage('nonexistent.key');
      expect(message).toBe('nonexistent.key');
    });

    it('should fallback to English when current language not found', () => {
      service.setLanguage('fr'); // French not supported
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Field {field} is required');
    });

    it('should handle missing parameters gracefully', () => {
      const message = service.getMessage('errors.validation.required', { wrongParam: 'value' });
      expect(message).toBe('Field {field} is required');
    });

    it('should handle empty parameters object', () => {
      const message = service.getMessage('errors.validation.required', {});
      expect(message).toBe('Field {field} is required');
    });

    it('should handle undefined parameters', () => {
      const message = service.getMessage('errors.validation.required', undefined);
      expect(message).toBe('Field {field} is required');
    });
  });

  describe('setLanguage', () => {
    it('should change current language', () => {
      service.setLanguage('pt');
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Campo {field} é obrigatório');
    });

    it('should handle unsupported language gracefully', () => {
      service.setLanguage('fr');
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Field {field} is required'); // Falls back to English
    });
  });

  describe('getLanguage', () => {
    it('should return English by default when no Accept-Language header', () => {
      const mockRequest = {
        headers: {},
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('en');
    });

    it('should parse Accept-Language header correctly', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('pt');
    });

    it('should handle single language in Accept-Language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'pt',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('pt');
    });

    it('should handle quality values in Accept-Language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'en;q=0.8,pt;q=0.9',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('pt'); // Higher quality
    });

    it('should fallback to English for unsupported language', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'fr-FR,fr;q=0.9',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('en');
    });

    it('should handle malformed Accept-Language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'invalid-header',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('en');
    });

    it('should handle empty Accept-Language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': '',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('en');
    });
  });

  describe('parseAcceptLanguage (private method via getLanguage)', () => {
    it('should extract primary language code from locale', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'pt-BR,en-US;q=0.8',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('pt');
    });

    it('should handle languages without quality values', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'pt,en',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('pt');
    });

    it('should sort by quality values correctly', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'en;q=0.1,pt;q=0.9,es;q=0.5',
        },
      } as FastifyRequest;

      const language = service.getLanguage(mockRequest);
      expect(language).toBe('pt'); // Highest quality
    });
  });

  describe('interpolate (private method via getMessage)', () => {
    it('should handle complex parameter interpolation', () => {
      const message = service.getMessage('errors.validation.min', { 
        field: 'password', 
        min: '8' 
      });
      expect(message).toBe('Field password must be at least 8');
    });

    it('should handle numeric parameters', () => {
      const message = service.getMessage('errors.validation.max', { 
        field: 'age', 
        max: 65 
      });
      expect(message).toBe('Field age must be at most 65');
    });

    it('should handle boolean parameters', () => {
      const message = service.getMessage('errors.validation.required', { 
        field: true 
      });
      expect(message).toBe('Field true is required');
    });

    it('should handle null and undefined parameters', () => {
      const message = service.getMessage('errors.validation.required', { 
        field: null 
      });
      expect(message).toBe('Field {field} is required'); // null falls back to original placeholder
    });

    it('should preserve unmatched placeholders', () => {
      const message = service.getMessage('errors.validation.required', { 
        wrongParam: 'value' 
      });
      expect(message).toBe('Field {field} is required');
    });
  });

  describe('Translation Coverage', () => {
    it('should have error messages for all categories', () => {
      const errorKeys = [
        'errors.validation.required',
        'errors.database.not_found',
        'errors.auth.unauthorized',
        'errors.transaction.not_found',
        'errors.category.not_found',
        'errors.payment_method.not_found',
        'errors.template.not_found',
        'errors.bulk.operation_failed',
      ];

      errorKeys.forEach(key => {
        const message = service.getMessage(key);
        expect(message).not.toBe(key); // Should not return the key itself
        expect(message).toBeTruthy();
      });
    });

    it('should have success messages for all categories', () => {
      const successKeys = [
        'success.transaction.created',
        'success.category.created',
        'success.payment_method.created',
        'success.template.created',
        'success.bulk.operation_completed',
      ];

      successKeys.forEach(key => {
        const message = service.getMessage(key);
        expect(message).not.toBe(key); // Should not return the key itself
        expect(message).toBeTruthy();
      });
    });

    it('should have general messages', () => {
      const generalKeys = [
        'general.server_error',
        'general.validation_error',
        'general.not_found',
        'general.unauthorized',
        'general.forbidden',
      ];

      generalKeys.forEach(key => {
        const message = service.getMessage(key);
        expect(message).not.toBe(key); // Should not return the key itself
        expect(message).toBeTruthy();
      });
    });
  });

  describe('Language Support', () => {
    it('should support English translations', () => {
      service.setLanguage('en');
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Field {field} is required');
    });

    it('should support Portuguese translations', () => {
      service.setLanguage('pt');
      const message = service.getMessage('errors.validation.required');
      expect(message).toBe('Campo {field} é obrigatório');
    });

    it('should have consistent translation coverage between languages', () => {
      const testKeys = [
        'errors.validation.required',
        'errors.database.not_found',
        'success.transaction.created',
        'general.server_error',
      ];

      testKeys.forEach(key => {
        // English
        service.setLanguage('en');
        const enMessage = service.getMessage(key);
        
        // Portuguese
        service.setLanguage('pt');
        const ptMessage = service.getMessage(key);
        
        // Both should be different from the key and truthy
        expect(enMessage).not.toBe(key);
        expect(ptMessage).not.toBe(key);
        expect(enMessage).toBeTruthy();
        expect(ptMessage).toBeTruthy();
      });
    });
  });

  describe('Singleton Instance', () => {
    it('should export singleton instance', () => {
      expect(i18nService).toBeInstanceOf(I18nService);
    });

    it('should maintain state across calls', () => {
      i18nService.setLanguage('pt');
      const message = i18nService.getMessage('errors.validation.required');
      expect(message).toBe('Campo {field} é obrigatório');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty key', () => {
      const message = service.getMessage('');
      expect(message).toBe('');
    });

    it('should handle key with special characters', () => {
      const message = service.getMessage('errors.validation.required', { 
        field: 'email@domain.com' 
      });
      expect(message).toBe('Field email@domain.com is required');
    });

    it('should handle very long parameter values', () => {
      const longValue = 'a'.repeat(1000);
      const message = service.getMessage('errors.validation.required', { 
        field: longValue 
      });
      expect(message).toBe(`Field ${longValue} is required`);
    });

    it('should handle circular reference in parameters', () => {
      const circular: any = {};
      circular.self = circular;
      
      const message = service.getMessage('errors.validation.required', { 
        field: circular 
      });
      expect(message).toBe('Field [object Object] is required');
    });
  });
});
