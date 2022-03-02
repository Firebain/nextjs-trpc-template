import { z, ZodIssueCode } from "zod";

const errorMap: z.ZodErrorMap = (issue, ctx) => {
  const getMessage = () => {
    if (issue.code === ZodIssueCode.invalid_string) {
      if (issue.validation === "email") {
        return "Введите действительный email";
      }
    }

    // switch (issue.code) {
    //   case ZodIssueCode.invalid_type:
    //     if (issue.received === "undefined") {
    //       return "Вы не заполнили";
    //     } else {
    //       return `Ожидалось ${issue.expected}, получено ${issue.received}`;
    //     }
    //   case ZodIssueCode.unrecognized_keys:
    //     const unrecognizedKeys = issue.keys.map((k) => `'${k}'`).join(", ");

    //     return `Не распознанные ключи в объекте: ${unrecognizedKeys}`;
    //   case ZodIssueCode.invalid_union:
    //     return "Не верный ввод";
    //   case ZodIssueCode.invalid_enum_value:
    //     const expected = issue.options
    //       .map((val) => (typeof val === "string" ? `'${val}'` : val))
    //       .join(" | ");

    //     const received =
    //       typeof ctx.data === "string" ? `'${ctx.data}'` : ctx.data;

    //     return `Не верное значение перечисления. Ожидалось ${expected}, получено ${received}`;
    //   case ZodIssueCode.invalid_arguments:
    //     return `Не верные аргументы функции`;
    //   case ZodIssueCode.invalid_return_type:
    //     return `Не верное возвращаемое значение аргумента`;
    //   case ZodIssueCode.invalid_date:
    //     return `Не верная дата`;
    //   case ZodIssueCode.invalid_string:
    //     return issue.validation !== "regex"
    //       ? `Не верное ${issue.validation}`
    //       : "Не верно";
    //   case ZodIssueCode.too_small:
    //     if (issue.type === "array")
    //       return `Должно иметь ${issue.inclusive ? "хотя бы" : "больше чем"} ${
    //         issue.minimum
    //       } значений`;
    //     else if (issue.type === "string")
    //       return `Должно иметь ${issue.inclusive ? "хотя бы" : "больше чем"} ${
    //         issue.minimum
    //       } символов`;
    //     else if (issue.type === "number")
    //       return `Значение должно быть больше ${
    //         issue.inclusive ? "и таким же" : ""
    //       } чем ${issue.minimum}`;
    //     else return "Не верное значение";
    //   case ZodIssueCode.too_big:
    //     if (issue.type === "array")
    //       return `Должно иметь ${issue.inclusive ? "хотя бы" : "меньше чем"} ${
    //         issue.maximum
    //       } значений`;
    //     else if (issue.type === "string")
    //       return `Должно иметь ${issue.inclusive ? "хотя бы" : "меньше чем"} ${
    //         issue.maximum
    //       } символов`;
    //     else if (issue.type === "number")
    //       return `Значение должно быть больше ${
    //         issue.inclusive ? "и таким же" : ""
    //       } чем ${issue.maximum}`;
    //     else return "Не верное значение";
    //   case ZodIssueCode.custom:
    //     return "Не верное значение";
    //   case ZodIssueCode.invalid_intersection_types:
    //     return "Пересечение не может обыть объеденено";
    //   case ZodIssueCode.not_multiple_of:
    //     return `Должно быть кратно ${issue.multipleOf}`;
    // }

    return ctx.defaultError;
  };

  return { message: getMessage() };
};

z.setErrorMap(errorMap);

export * from "./auth";
