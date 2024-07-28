import {
  createRdhKey,
  GeneralColumnType,
  resolveCodeLabel,
  ResultSetDataBuilder,
} from "../src";

const createRdb = (): ResultSetDataBuilder => {
  const rdb = new ResultSetDataBuilder([
    createRdhKey({ name: "n1", type: GeneralColumnType.INTEGER }),
    createRdhKey({ name: "s1", type: GeneralColumnType.TEXT }),
    createRdhKey({ name: "d1", type: GeneralColumnType.DATE }),
    createRdhKey({ name: "t1", type: GeneralColumnType.TIMESTAMP }),
    createRdhKey({ name: "b1", type: GeneralColumnType.BLOB }),
  ]);

  for (let i = 1; i <= 30; i++) {
    rdb.addRow({
      n1: i % 3,
      s1: i % 3 === 0 ? null : `${i}`,
      d1: new Date("2024-08-01 00:00:00"),
      t1: new Date("2024-08-01 10:20:30"),
      b1: Buffer.from([0, 1, 2, 244]),
    });
  }

  rdb.setSummary({
    elapsedTimeMilli: 3000,
    affectedRows: 0,
    insertId: 0,
    changedRows: 0,
  });

  rdb.rs.meta.codeItems = [
    {
      title: "nc",
      resource: {
        column: {
          regex: false,
          pattern: "n1",
        },
      },
      details: [
        {
          code: "0",
          label: "green",
        },
        {
          code: "1",
          label: "yellow",
        },
        {
          code: "2",
          label: "red",
        },
      ],
    },
  ];
  resolveCodeLabel(rdb.rs);

  return rdb;
};

describe("ResultSetDataBuilder", () => {
  const rdb = createRdb();

  describe("from", () => {
    it("should be copied Buffer", () => {
      const copied = ResultSetDataBuilder.from(rdb.rs);
      expect(copied.rs.rows).toHaveLength(30);
      const row = copied.rs.rows[0];
      expect(row.values.b1).not.toBeUndefined();
      expect(Buffer.isBuffer(row.values.b1)).toBe(true);
      expect(row.values.b1).toEqual(Buffer.from([0, 1, 2, 244]));
    });
  });

  describe("toMarkdown", () => {
    it("should be success withCodeLabel", () => {
      expect(rdb.toMarkdown({ withCodeLabel: true })).toEqual(
        `| n1 | s1 | d1 | t1 | b1 |
| ---: | :--- | :---: | :---: | :---: |
| 1 &lt;yellow&gt; | 1 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 2 &lt;red&gt; | 2 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 0 &lt;green&gt; | \`NULL\` | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 1 &lt;yellow&gt; | 4 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 2 &lt;red&gt; | 5 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| ... | ... | ... | ... | ... |
| 2 &lt;red&gt; | 26 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 0 &lt;green&gt; | \`NULL\` | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 1 &lt;yellow&gt; | 28 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 2 &lt;red&gt; | 29 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
| 0 &lt;green&gt; | \`NULL\` | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) |
`
      );
    });
  });
  describe("toPlainText", () => {
    it("should be success withCodeLabel", () => {
      expect(rdb.toString({ withCodeLabel: true }))
        .toEqual(`n1         s1  d1         t1                  b1      
1 <yellow> 1   2024-08-01 2024-08-01 10:20:30 (BINARY)
2 <red>    2   2024-08-01 2024-08-01 10:20:30 (BINARY)
0 <green>      2024-08-01 2024-08-01 10:20:30 (BINARY)
1 <yellow> 4   2024-08-01 2024-08-01 10:20:30 (BINARY)
2 <red>    5   2024-08-01 2024-08-01 10:20:30 (BINARY)
...        ... ...        ...                 ...     
2 <red>    26  2024-08-01 2024-08-01 10:20:30 (BINARY)
0 <green>      2024-08-01 2024-08-01 10:20:30 (BINARY)
1 <yellow> 28  2024-08-01 2024-08-01 10:20:30 (BINARY)
2 <red>    29  2024-08-01 2024-08-01 10:20:30 (BINARY)
0 <green>      2024-08-01 2024-08-01 10:20:30 (BINARY)
`);
    });

    it("should be success binaryToHex", () => {
      expect(rdb.toString({ binaryToHex: true }))
        .toEqual(`n1  s1  d1         t1                  b1        
1   1   2024-08-01 2024-08-01 10:20:30 B'000102f4
2   2   2024-08-01 2024-08-01 10:20:30 B'000102f4
0       2024-08-01 2024-08-01 10:20:30 B'000102f4
1   4   2024-08-01 2024-08-01 10:20:30 B'000102f4
2   5   2024-08-01 2024-08-01 10:20:30 B'000102f4
... ... ...        ...                 ...       
2   26  2024-08-01 2024-08-01 10:20:30 B'000102f4
0       2024-08-01 2024-08-01 10:20:30 B'000102f4
1   28  2024-08-01 2024-08-01 10:20:30 B'000102f4
2   29  2024-08-01 2024-08-01 10:20:30 B'000102f4
0       2024-08-01 2024-08-01 10:20:30 B'000102f4
`);
    });
  });
  describe("toCsv", () => {
    it("should be success withCodeLabel, delimiter:comma", () => {
      expect(rdb.toCsv({ withCodeLabel: true }))
        .toEqual(`"n1","s1","d1","t1","b1"
"1 <yellow>","1","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"2 <red>","2","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"0 <green>","","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"1 <yellow>","4","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"2 <red>","5","2024-08-01","2024-08-01 10:20:30","(BINARY)"
...,...,...,...,...
"2 <red>","26","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"0 <green>","","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"1 <yellow>","28","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"2 <red>","29","2024-08-01","2024-08-01 10:20:30","(BINARY)"
"0 <green>","","2024-08-01","2024-08-01 10:20:30","(BINARY)"
`);
    });
    it("should be success withCodeLabel, delimiter:tab", () => {
      expect(rdb.toCsv({ withCodeLabel: true, csv: { delimiter: "\t" } }))
        .toEqual(`"n1"\t"s1"\t"d1"\t"t1"\t"b1"
"1 <yellow>"\t"1"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"2 <red>"\t"2"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"0 <green>"\t""\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"1 <yellow>"\t"4"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"2 <red>"\t"5"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
...\t...\t...\t...\t...
"2 <red>"\t"26"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"0 <green>"\t""\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"1 <yellow>"\t"28"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"2 <red>"\t"29"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
"0 <green>"\t""\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"
`);
    });
  });
  describe("toHtml", () => {
    it("should be success withCodeLabel", () => {
      expect(rdb.toHtml({ withCodeLabel: true }))
        .toEqual(`<div class="table-container">
<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
<thead>
  <tr class=""><th>n1</th><th>s1</th><th>d1</th><th>t1</th><th>b1</th></tr>
</thead>
<tbody>
  <tr class=""><td class="">1 <span class="tag is-info is-light">yellow</span></td><td class="">1</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">2</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">0 <span class="tag is-info is-light">green</span></td><td class=""><span class="tag is-light">NULL</span></td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">1 <span class="tag is-info is-light">yellow</span></td><td class="">4</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">5</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">26</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">0 <span class="tag is-info is-light">green</span></td><td class=""><span class="tag is-light">NULL</span></td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">1 <span class="tag is-info is-light">yellow</span></td><td class="">28</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">29</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
  <tr class=""><td class="">0 <span class="tag is-info is-light">green</span></td><td class=""><span class="tag is-light">NULL</span></td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td></tr>
</tbody>
</table>
</div>
`);
    });
  });
});
