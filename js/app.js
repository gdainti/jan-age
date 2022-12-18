(function () {

  const DEFAULT_BIRTH_STRING = "2022-11-02T14:35:00.000+02:00";
  const UPDATE_INTERVAL = 1000;
  const APP_ELEMENT = document.getElementById('app');

  let birthString = DEFAULT_BIRTH_STRING;

  /* { [key: string]: HTMLDivElement } */
  const elements = {};

  const updateElement = (id, content) => {

    if (!APP_ELEMENT) {
      return;
    }

    if (elements[id]) {
      elements[id].innerHTML = content;
      return;
    }

    const element = document.createElement('div');
    element.id = id;
    element.innerHTML = content;
    elements[id] = element;
    APP_ELEMENT.appendChild(element);
  };

  const appendInput = () => {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "dob";
    input.value = DEFAULT_BIRTH_STRING;
    input.classList.add("valid");

    input.addEventListener('input', () => {
      if (moment(input.value, true).isValid() && moment().diff(moment(input.value)) > 0) {
        birthString = input.value;
        input.classList.add("valid");
        input.classList.remove("invalid");
      }
      else {
        input.classList.add("invalid");
        input.classList.remove("valid");
      }
    });

    APP_ELEMENT.appendChild(input);
  }

  const update = () => {

    const birthMoment = moment(new Date(birthString));
    const currentTime = moment();

    const timeBetween = moment.duration(currentTime.diff(birthMoment));
    const diffMs =  timeBetween.asMilliseconds();

    if (diffMs < 0) {
      return;
    }

    const days = Math.floor(timeBetween.asDays());
    const weeks = Math.floor(days / 7);
    const weekDays = days % 7;

    updateElement('years', `${timeBetween.years()} years ${timeBetween.months()} months ${timeBetween.days()} days [${parseFloat(timeBetween.asYears()).toFixed(2)}y]`);
    updateElement('days', `${days} days ${timeBetween.hours()}h:${timeBetween.minutes()}m:${timeBetween.seconds()}s`);

    updateElement('month', `${Math.floor(timeBetween.asMonths())} months [${parseFloat(timeBetween.asMonths()).toFixed(2)}m]`);
    updateElement('weeks', `${weeks} weeks ${weekDays} days`);
    updateElement('hours', `${Math.floor(timeBetween.asHours())} hours`);
    updateElement('minutes', `${Math.floor(timeBetween.asMinutes())} minutes`);
    updateElement('seconds', `${Math.floor(timeBetween.asSeconds())} seconds`);
  };

  const init = () => {
    appendInput();
    update();
    setInterval(() => {
      update();
    }, UPDATE_INTERVAL);
  };

  init();

})();