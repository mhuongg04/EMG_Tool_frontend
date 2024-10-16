# MOCK DATA

## file [001-012].json

Json schema description by TypeScript below

``` typescript
type Coordinates = number[]

type Wave = Coordinates[]

export type JsonMock = Wave[]
```

example:
``` JSON
[
    [
        [0, 1, 2, 3, 4], // x coordinates
        [5, 10, -20, -4, -5] // y coordinates
    ]
    // Other wave
]
```

## read.py

Generate JSON from data.txt

```
python read.py 'data/Nguyen Thi HuongBs Giang#001.txt' -o 001.json
```