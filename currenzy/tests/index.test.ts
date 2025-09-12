import chalk from 'chalk';
import { testCbrfProvider } from './providers/cbrf.test';

(async () => {
  console.log(chalk.cyan('🚀 Запуск всех тестов...\n'));

  try {
    await testCbrfProvider();
    console.log(chalk.green('\n✅ Все тесты завершены успешно.'));
  } catch (err) {
    console.log(chalk.red('\n❌ Ошибка при тестировании:'), err);
  }
})();
