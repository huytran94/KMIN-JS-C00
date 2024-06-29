export class Helper {
  isEmptyString(txt) {
    return txt.trim().length === 0;
  }
  isPositiveNumber(numb) {
    let number = parseFloat(numb);
    return !isNaN(number) && number >= 0;
  }
}
