// strips direction such as asc and desc and their ()
export const parseKeysToLabel = (key: string) => {
  const fnMatch = key.match(/^(asc|desc)\((\w+)\)$/i);

  let array: string[];
  if (fnMatch) {
    const [, dir, col] = fnMatch;
    array = col ? col.split("") : key.split("");
  } else {
    array = key.split("");
  }
  const fullText = array
    .map((item, i, arr) => {
      // First character must be capital
      if (i === 0) {
        return item.toLocaleUpperCase();
      }

      if (i - 1 === 0) {
        return item.toLocaleLowerCase();
      }

      // Check if the rest of the characters are uppercase or not
      // if it is then check if the previous character [i - 1] is in lowercase
      // if it is then return space  with the item
      // if not then return it as lower
      if (item == item.toLocaleUpperCase()) {
        if (array[i - 1] == array[i - 1].toLocaleLowerCase()) {
          return ` ${item.toLocaleLowerCase()}`;
        }
        return item.toLocaleLowerCase();
      }
      return item;
    })
    .join("");

  return fullText;
};
