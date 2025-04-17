import React from 'react';

// Типы для функций обработки
type SetStateNumberFunction = (value: string) => void;
type InputEvent = React.ChangeEvent<HTMLInputElement>;
type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

// Хелперы для обработки ввода чисел с плавающей точкой (FEE и BUY)
export const createFloatHandlers = (setValue: SetStateNumberFunction) => {
  // Обработчик изменения значения  
  const handleChange = (e: InputEvent) => {
    let inputValue = e.target.value;
    
    // Заменяем запятую на точку
    inputValue = inputValue.replace(',', '.');
    
    // Если пользователь ввел ".ХХХ", добавляем ноль в начало: "0.ХХХ"
    if (inputValue.startsWith('.')) {
      inputValue = '0' + inputValue;
    }
    
    // Обработка нескольких нулей в начале (00000 -> 0.0000)
    if (inputValue === '00') {
      inputValue = '0.0';
      
      // Устанавливаем курсор после последнего нуля
      setTimeout(() => {
        const inputElement = e.target as HTMLInputElement;
        inputElement.setSelectionRange(3, 3);
      }, 0);
    }
    // Обработка ввода дополнительных нулей после "00"
    else if (inputValue.startsWith('00')) {
      // Проверяем, есть ли точка
      if (!inputValue.includes('.')) {
        // Преобразуем "00XXX" -> "0.0XXX"
        inputValue = '0.0' + inputValue.substring(2);
        
        // Устанавливаем курсор в правильную позицию
        setTimeout(() => {
          const inputElement = e.target as HTMLInputElement;
          const cursorPosition = inputElement.selectionStart || 0;
          // Сдвигаем курсор на один символ вправо (из-за добавления точки)
          inputElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        }, 0);
      }
    }
    
    // Проверка, что ввод - это пустая строка или число с плавающей точкой
    if (inputValue === '' || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
      // Проверяем, что число не отрицательное
      if (inputValue === '' || !isNaN(parseFloat(inputValue))) {
        setValue(inputValue);
      }
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: KeyboardEvent) => {
    // Обрабатываем запятую или точку
    if (e.key === ',' || e.key === '.') {
      e.preventDefault();
      
      // Получаем текущую позицию курсора и значение
      const cursorPosition = e.currentTarget.selectionStart || 0;
      const value = e.currentTarget.value;
      
      // Если точки еще нет
      if (!value.includes('.')) {
        let newValue;
        
        // Если поле пустое или курсор в начале - добавляем "0."
        if (value === '' || cursorPosition === 0) {
          newValue = '0.' + value.substring(cursorPosition);
          // Устанавливаем курсор после точки
          setTimeout(() => {
            e.currentTarget.setSelectionRange(2, 2);
          }, 0);
        } else {
          newValue = 
            value.substring(0, cursorPosition) + 
            '.' + 
            value.substring(cursorPosition);
          // Устанавливаем курсор после точки
          setTimeout(() => {
            e.currentTarget.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
          }, 0);
        }
        
        setValue(newValue);
      }
      return;
    }
    
    // Специальная обработка нуля
    if (e.key === '0') {
      const value = e.currentTarget.value;
      const cursorPosition = e.currentTarget.selectionStart || 0;
      
      // Если в поле уже есть только один ноль и курсор после него
      if (value === '0' && cursorPosition === 1) {
        e.preventDefault();
        
        // Заменяем на "0.0"
        const newValue = '0.0';
        setValue(newValue);
        
        // Устанавливаем курсор после последнего нуля
        setTimeout(() => {
          e.currentTarget.setSelectionRange(3, 3);
        }, 0);

        return;
      }
    }
    
    // Разрешаем: цифры, точку, backspace, delete, tab, escape, enter и стрелки
    if (
      !/[0-9\.]/.test(e.key) && 
      e.key !== 'Backspace' && 
      e.key !== 'Delete' && 
      e.key !== 'Tab' && 
      e.key !== 'Escape' && 
      e.key !== 'Enter' && 
      e.key !== 'ArrowLeft' && 
      e.key !== 'ArrowRight' && 
      e.key !== 'ArrowUp' && 
      e.key !== 'ArrowDown'
    ) {
      e.preventDefault();
    }
    
    // Проверка на вторую точку
    if (e.key === '.' && e.currentTarget.value.includes('.')) {
      e.preventDefault();
    }
  };

  return { handleChange, handleKeyDown };
};

// Хелперы для обработки ввода целых чисел (SLIP и SELL)
export const createIntegerHandlers = (setValue: SetStateNumberFunction) => {
  // Обработчик изменения значения
  const handleChange = (e: InputEvent) => {
    let inputValue = e.target.value;
    
    // Проверка, что ввод - это пустая строка или целое число
    if (inputValue === '' || /^[0-9]*$/.test(inputValue)) {
      // Сохраняем исходное значение для проверки изменений
      let finalValue = inputValue;
      
      // Специальная обработка нулей
      if (inputValue === '0') {
        finalValue = '1';
      } 
      // Если введено ровно 2 нуля
      else if (inputValue === '00') {
        finalValue = '10';
      } 
      // Если введено 3+ нуля или число больше 100
      else if (inputValue === '000' || (inputValue.length >= 3 && parseInt(inputValue) > 100)) {
        finalValue = '100';
      }
      // Для чисел больше 100, устанавливаем максимум в 100
      else if (inputValue !== '' && parseInt(inputValue) > 100) {
        finalValue = '100';
      }
      
      // Устанавливаем значение
      setValue(finalValue);
      
      // Если было специальное преобразование, устанавливаем курсор в конец
      if (e.target.value !== finalValue) {
        setTimeout(() => {
          const inputElement = e.target as HTMLInputElement;
          inputElement.setSelectionRange(finalValue.length, finalValue.length);
        }, 0);
      }
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: KeyboardEvent) => {
    // Специальная обработка нуля
    if (e.key === '0') {
      const value = e.currentTarget.value;
      const cursorPosition = e.currentTarget.selectionStart || 0;
      const selectionLength = (e.currentTarget.selectionEnd || 0) - cursorPosition;
      
      // Если поле пустое, заменяем на "1"
      if (value === '' && cursorPosition === 0) {
        e.preventDefault();
        const newValue = '1';
        setValue(newValue);
        
        setTimeout(() => {
          e.currentTarget.setSelectionRange(1, 1);
        }, 0);
        
        return;
      }
      
      // Если в поле один ноль, заменяем на "10"
      if (value === '0' && cursorPosition === 1 && selectionLength === 0) {
        e.preventDefault();
        const newValue = '10';
        setValue(newValue);
        
        setTimeout(() => {
          e.currentTarget.setSelectionRange(2, 2);
        }, 0);
        
        return;
      }
      
      // Если в поле два нуля, заменяем на "100"
      if (value === '00' && cursorPosition === 2 && selectionLength === 0) {
        e.preventDefault();
        const newValue = '100';
        setValue(newValue);
        
        setTimeout(() => {
          e.currentTarget.setSelectionRange(3, 3);
        }, 0);
        
        return;
      }
      
      // Если новое значение с нулем будет > 100, заменяем на 100
      const potentialNewValue = value.substring(0, cursorPosition) + '0' + value.substring(cursorPosition + selectionLength);
      if (parseInt(potentialNewValue) > 100) {
        e.preventDefault();
        const newValue = '100';
        setValue(newValue);
        
        setTimeout(() => {
          e.currentTarget.setSelectionRange(3, 3);
        }, 0);

        return;
      }
    }
    
    // Разрешаем: цифры, backspace, delete, tab, escape, enter и стрелки
    if (
      !/[0-9]/.test(e.key) && 
      e.key !== 'Backspace' && 
      e.key !== 'Delete' && 
      e.key !== 'Tab' && 
      e.key !== 'Escape' && 
      e.key !== 'Enter' && 
      e.key !== 'ArrowLeft' && 
      e.key !== 'ArrowRight' && 
      e.key !== 'ArrowUp' && 
      e.key !== 'ArrowDown'
    ) {
      e.preventDefault();
    }
  };

  return { handleChange, handleKeyDown };
};