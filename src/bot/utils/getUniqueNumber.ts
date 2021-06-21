
const onlyUnique = (value: number, index: number, self: number[]) => {
    return self.indexOf(value) === index;
}

export default (values: number[]): number[] => {
      return values.filter(onlyUnique);
}