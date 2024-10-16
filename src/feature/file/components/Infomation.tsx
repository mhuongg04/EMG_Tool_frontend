interface IProps {
  name?: string;
  age?: number;
  sex?: string;
  date?: string;
  time?: string;
}

export default function Information({ name, age, sex, date, time }: IProps) {
  return (
    <div className="px-8">
      <h2 className="font-semibold text-lg mb-4">Patient's Information</h2>
      <div className="flex gap-8 text-start">
        <div className="font-semibold text-end">
          <h3>Name :</h3>
          <h3>Age :</h3>
          <h3>Sex :</h3>
          <h3>Date :</h3>
          <h3>Time :</h3>
        </div>
        <div className="">
          <h3>{name}</h3>
          <h3>{age != 0 && age}</h3>
          <h3>{sex}</h3>
          <h3>{date}</h3>
          <h3>{time}</h3>
        </div>
      </div>
    </div>
  );
}
