import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '../components/Button';
import { Save, Delete } from '@mui/icons-material';

// Мок темы для Material-UI
const theme = createTheme();

// Обертка для рендеринга с темой
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Button Component', () => {

  describe('Базовый рендеринг', () => {
    it('должен рендериться с базовыми пропсами', () => {
      renderWithTheme(<Button testId="test-button">Кнопка</Button>);

      const button = screen.getByTestId('test-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Кнопка');
    });

    it('должен применять правильные классы Material-UI', () => {
      renderWithTheme(
        <Button variant="outlined" color="secondary" size="large" testId="test-button">
          Тест
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveClass('MuiButton-outlined');
      expect(button).toHaveClass('MuiButton-sizeLarge');
    });

    it('должен рендериться как кнопка по умолчанию', () => {
      renderWithTheme(<Button testId="test-button">Кнопка</Button>);

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Состояние loading', () => {
    it('должен показывать спиннер при loading=true', () => {
      renderWithTheme(
        <Button loading testId="test-button">
          Сохранить
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveTextContent('Загрузка...');
      expect(button).toBeDisabled();

      // Проверяем наличие спиннера
      const spinner = button.querySelector('.MuiCircularProgress-root');
      expect(spinner).toBeInTheDocument();
    });

    it('должен показывать кастомный текст загрузки', () => {
      renderWithTheme(
        <Button loading loadingText="Отправка..." testId="test-button">
          Отправить
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveTextContent('Отправка...');
    });

    it('не должен вызывать onClick при loading', () => {
      const handleClick = jest.fn();

      renderWithTheme(
        <Button loading onClick={handleClick} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Состояние disabled', () => {
    it('должен быть отключен при disabled=true', () => {
      renderWithTheme(
        <Button disabled testId="test-button">
          Отключена
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toBeDisabled();
    });

    it('не должен вызывать onClick при disabled', () => {
      const handleClick = jest.fn();

      renderWithTheme(
        <Button disabled onClick={handleClick} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Обработка событий', () => {
    it('должен вызывать onClick при клике', () => {
      const handleClick = jest.fn();

      renderWithTheme(
        <Button onClick={handleClick} testId="test-button">
          Кликни меня
        </Button>
      );

      const button = screen.getByTestId('test-button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('должен передавать event в onClick', () => {
      const handleClick = jest.fn();

      renderWithTheme(
        <Button onClick={handleClick} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('должен работать с множественными кликами', () => {
      const handleClick = jest.fn();

      renderWithTheme(
        <Button onClick={handleClick} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Иконки', () => {
    it('должен отображать startIcon', () => {
      renderWithTheme(
        <Button startIcon={<Save data-testid="save-icon" />} testId="test-button">
          Сохранить
        </Button>
      );

      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
    });

    it('должен отображать endIcon', () => {
      renderWithTheme(
        <Button endIcon={<Delete data-testid="delete-icon" />} testId="test-button">
          Удалить
        </Button>
      );

      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('должен скрывать endIcon при loading', () => {
      renderWithTheme(
        <Button loading endIcon={<Delete data-testid="delete-icon" />} testId="test-button">
          Удалить
        </Button>
      );

      expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    it('должен заменять startIcon на спиннер при loading', () => {
      renderWithTheme(
        <Button loading startIcon={<Save data-testid="save-icon" />} testId="test-button">
          Сохранить
        </Button>
      );

      const button = screen.getByTestId('test-button');
      const spinner = button.querySelector('.MuiCircularProgress-root');

      expect(spinner).toBeInTheDocument();
      expect(screen.queryByTestId('save-icon')).not.toBeInTheDocument();
    });
  });

  describe('Варианты кнопок', () => {
    it.each([
      ['text', 'MuiButton-text'],
      ['outlined', 'MuiButton-outlined'],
      ['contained', 'MuiButton-contained']
    ])('должен применять правильный класс для variant="%s"', (variant, expectedClass) => {
      renderWithTheme(
        <Button variant={variant} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveClass(expectedClass);
    });

    it.each([
      ['small', 'MuiButton-sizeSmall'],
      ['medium', 'MuiButton-sizeMedium'],
      ['large', 'MuiButton-sizeLarge']
    ])('должен применять правильный класс для size="%s"', (size, expectedClass) => {
      renderWithTheme(
        <Button size={size} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveClass(expectedClass);
    });
  });

  describe('Accessibility', () => {
    it('должен иметь правильную роль', () => {
      renderWithTheme(<Button testId="test-button">Кнопка</Button>);

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('role', 'button');
    });

    it('должен быть доступен для screen readers', () => {
      renderWithTheme(<Button testId="test-button">Отправить форму</Button>);

      const button = screen.getByRole('button', { name: /отправить форму/i });
      expect(button).toBeInTheDocument();
    });

    it('должен показывать состояние disabled для screen readers', () => {
      renderWithTheme(
        <Button disabled testId="test-button">
          Отключена
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Типы кнопок', () => {
    it('должен устанавливать type="submit"', () => {
      renderWithTheme(
        <Button type="submit" testId="test-button">
          Отправить
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('должен устанавливать type="reset"', () => {
      renderWithTheme(
        <Button type="reset" testId="test-button">
          Сбросить
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Дополнительные пропсы', () => {
    it('должен применять fullWidth', () => {
      renderWithTheme(
        <Button fullWidth testId="test-button">
          Полная ширина
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveClass('MuiButton-fullWidth');
    });

    it('должен передавать дополнительные пропсы', () => {
      renderWithTheme(
        <Button
          testId="test-button"
          data-custom="custom-value"
          aria-label="Кастомная метка"
        >
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('data-custom', 'custom-value');
      expect(button).toHaveAttribute('aria-label', 'Кастомная метка');
    });
  });

  describe('Интеграционные тесты', () => {
    it('должен работать в форме', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());

      renderWithTheme(
        <form onSubmit={handleSubmit}>
          <Button type="submit" testId="submit-button">
            Отправить
          </Button>
        </form>
      );

      const button = screen.getByTestId('submit-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('должен работать с ref', () => {
      let buttonRef;

      const TestComponent = () => {
        return (
          <Button
            ref={(ref) => { buttonRef = ref; }}
            testId="test-button"
          >
            Кнопка с ref
          </Button>
        );
      };

      renderWithTheme(<TestComponent />);

      expect(buttonRef).toBeInstanceOf(HTMLButtonElement);
      expect(buttonRef).toHaveTextContent('Кнопка с ref');
    });
  });

  describe('Граничные случаи', () => {
    it('должен обрабатывать пустые children', () => {
      renderWithTheme(<Button testId="test-button"></Button>);

      const button = screen.getByTestId('test-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('должен обрабатывать null onClick', () => {
      renderWithTheme(
        <Button onClick={null} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('должен обрабатывать undefined onClick', () => {
      renderWithTheme(
        <Button onClick={undefined} testId="test-button">
          Кнопка
        </Button>
      );

      const button = screen.getByTestId('test-button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });
});
