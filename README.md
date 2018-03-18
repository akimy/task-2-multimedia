#### Домашнее задание по лекции "Мультимедиа"
Преподаватели:   
Завьялов Александр, Алексей Гусев

Link to app: https://akimy.github.io/task-3-multimedia/
Link to sources: https://github.com/akimy/task-3-multimedia

##### Задание
Сделать веб-приложение, которое визуализирует то, как робот видит окружающий мир

##### Файловая структура
Файловая структура проекта имеет следующий вид:  
* src - исходный javascript код
  * classes - импортируемые классы
  * index.js - точка входа для вебпака
* bundle.js - собранный билд для gh pages (чисто для домашнего задания)
* index.html - layout
* styles.css - стили

##### Сборка
```npm install```
```npm run build```

##### Интерфейс терминатора

![Изображение](https://i.imgur.com/nXkJTLD.jpg?1)

Интерфейс терминатора состоит из вращающегося символа biohazard, надписи avarage color с HEX значением
среднего цвета на экране, текущим временем в Timestamd и DateString форматах, надписью о детекте если на экране замечено движение, квадрате со средним цветом (можете проверить и поднести камеру к яркой желтой/красной стене в яндексе или поднести цветную бумагу. Квадрат должен принять соответствующий цвет), гистограммы звуковой волны (из буфера аудио), общего ползунка громкости в правом нижнем углу и кнопки включения/выключения Yandex SpeechKit API в левом нижнем углу.

##### Выполнение и используемые технологии
CSS keyframes: Анимация вращения символа biohazard в правом-верхнему углу.  
CSS layers blending mode: Режим наложения с canvas видеопотока (multiply) и overlay для символа biohazard.  
CSS filters: Повышена контрастность для canvas слоя с видео.

Canvas: Обработка видеоканала и наложение помех совершается в классе VideoScene в методе drawNoiseAndComputeAvarageColor. Для каждого 15-го пиксела в красный канал подмешивается случайное значение от 0 до 255, поскольку на изображение наложен рыжий/красный фильтр, это вызывает эффект помех. В этом же методе подсчитывается и средний цвет на холсте.   

Yandex SpeechKit API: для воспроизведения голоса при детекте движения. Получилось немного раздражающе и поэтому выключил его и добавил кнопку на интерфейс, с помощью которой его можно включить.   
  
Web Audio API: createMediaStreamSource, getUserMedia для получения потока данных с аудио. Гистограмма и столб громкости рисуются в методе drawHistogramm класса TerminatorInterface.  
  
О детекте движения:
Пробовал подключать tracking.js, но поскольку у меня не используется WebGL технологий в проекте без того просевший FPS упал до 2-4. Почитал немного исходники их распознователя лица, там лежит обученная нейронка и раз в несколько секунд проходит поток данных в 160кб. Поэтому решил сделать проще - я рассчитал средний цвет на потоке и если сумма отклонения всех каналов среднего цвета превышает 7px - то зафиксированно движение. Таким образом появление объекта или его исчезновение из кадра вызывает детект.

О производительности:
Пытался любым способом поднять производительность, но она у меня значительно падала даже при выводе видео на экран (без эффектов), мой мак без дискретной GPU. У людей с ноутами оснащенными мало-мальской GPU - 60 FPS. У меня 40-55, но на вид значительно меньше. Смотрел вкладку perfomance - первая по потере производительности вещь - getImageData (функция для получения данных с видеопотока), вторая - compositLayers (обработка наложения на фон). Вообще надеюсь у вас устройство с GPU. Так же можете поэксперементировать с мобильными устройствами.
  

