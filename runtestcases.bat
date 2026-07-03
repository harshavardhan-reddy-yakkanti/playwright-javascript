@echo off

call npx playwright test --grep @smoke

set TEST_RESULT=%ERRORLEVEL%

call npx allure generate .\allure-results --clean -o allure-report

exit /b %TEST_RESULT%