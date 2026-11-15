# Стани блока фотоаналізу

Діаграми state-prepare.drawio і state-analysis.drawio в папці diagrams описують блок роботи з фото в AnalyzePage. Позначка A пов’язує дві частини схеми.

| Поточний стан | Подія | Наступний стан |
| --- | --- | --- |
| idle | Вибір файла | validating |
| validating | Файл підготовлено | ready |
| validating | Помилка перевірки або декодування | error |
| ready | Запуск аналізу | analyzing |
| ready | Прибирання фото | idle |
| analyzing | Отримано результат | result |
| analyzing | Скасування | ready |
| analyzing | Помилка сервісу | error |
| error | Вибір іншого файла | validating |
| error | Повторний запуск із підготовленим фото | analyzing |
| result | Натискання «Аналізувати інше фото» | idle |

Заміна файла скасовує попередню операцію й запускає validating. У стані result форма прихована, тому спочатку потрібно почати новий аналіз. AbortController і operation.current не дозволяють застарілій відповіді змінити інтерфейс. Вихід зі сторінки скасовує активний запит.
