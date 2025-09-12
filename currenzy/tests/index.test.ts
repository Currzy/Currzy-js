import chalk from 'chalk';
import { testCbrfProvider } from './providers/cbrf.test.ts';

(async () => {
  console.log(chalk.cyan('🚀 Запуск всех тестов...\n'));

  try {
    await testCbrfProvider();
    console.log(chalk.green('\n✅ Все тесты завершены успешно.'));
  } catch (err) {
    console.error(chalk.red('\n❌ Ошибка при тестировании:'), err);
    process.exit(1); // чтобы CI/терминал правильно понял, что тесты упали
  }
})();
