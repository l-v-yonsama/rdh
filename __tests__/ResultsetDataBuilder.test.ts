import {
  createRdhKey,
  createRdhKeysOf,
  GeneralColumnType,
  resolveCodeLabel,
  ResultSetDataBuilder,
  setOf,
} from "../src";

const createRdb = (): ResultSetDataBuilder => {
  const rdb = new ResultSetDataBuilder([
    createRdhKey({ name: "n1", type: GeneralColumnType.INTEGER }),
    createRdhKey({ name: "s1", type: GeneralColumnType.TEXT }),
    createRdhKey({ name: "d1", type: GeneralColumnType.DATE }),
    createRdhKey({ name: "t1", type: GeneralColumnType.TIMESTAMP }),
    createRdhKey({ name: "b1", type: GeneralColumnType.BLOB }),
    createRdhKey({ name: "ss1", type: GeneralColumnType.STRING_SET }),
    createRdhKey({ name: "ns1", type: GeneralColumnType.NUMERIC_SET }),
  ]);

  for (let i = 1; i <= 30; i++) {
    rdb.addRow({
      n1: i % 3,
      s1: i % 3 === 0 ? null : `${i}`,
      d1: new Date("2024-08-01 00:00:00"),
      t1: new Date("2024-08-01 10:20:30"),
      b1: Buffer.from([0, 1, 2, 244]),
      ss1: setOf("a" + i, "b" + i),
      ns1: setOf(i, i + 1),
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
    it("empty string should be null", () => {
      const CSV: any[][] = [
        [
          "sepal.length",
          "sepal.width",
          "petal.length",
          "petal.width",
          "truthy",
          "variety",
        ],
        [, 3.5, 1.4, 0.2, "TRUE", "Setosa"],
        [4.7, , 1.3, 0.2, "FALSE", "Setosa"],
        [7, 3.2, 4.7, , "True", "Versicolor"],
      ];

      const rdb = ResultSetDataBuilder.from(CSV, { firstRowAsTitle: true });
      console.log(rdb.toMarkdown({ withType: true }));
    });
  });

  describe("toMarkdown", () => {
    it("should be success withCodeLabel", () => {
      expect(rdb.toMarkdown({ withCodeLabel: true })).toEqual(
        `| n1 | s1 | d1 | t1 | b1 | ss1 | ns1 |
| ---: | :--- | :---: | :---: | :---: | :--- | :--- |
| 1 &lt;yellow&gt; | 1 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a1","b1"] | [1,2] |
| 2 &lt;red&gt; | 2 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a2","b2"] | [2,3] |
| 0 &lt;green&gt; | \`NULL\` | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a3","b3"] | [3,4] |
| 1 &lt;yellow&gt; | 4 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a4","b4"] | [4,5] |
| 2 &lt;red&gt; | 5 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a5","b5"] | [5,6] |
| ... | ... | ... | ... | ... | ... | ... |
| 2 &lt;red&gt; | 26 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a26","b26"] | [26,27] |
| 0 &lt;green&gt; | \`NULL\` | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a27","b27"] | [27,28] |
| 1 &lt;yellow&gt; | 28 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a28","b28"] | [28,29] |
| 2 &lt;red&gt; | 29 | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a29","b29"] | [29,30] |
| 0 &lt;green&gt; | \`NULL\` | 2024-08-01 | 2024-08-01 10:20:30 | (BINARY) | ["a30","b30"] | [30,31] |
`
      );
    });

    it("should be no records", () => {
      const rdb = ResultSetDataBuilder.createEmpty({
        noRecordsReason: "No records...",
      });
      expect(rdb.toMarkdown()).toBe("No records...");
      const rdb2 = ResultSetDataBuilder.createEmpty();
      expect(rdb2.toMarkdown()).toBe("No Records.");
    });
  });
  describe("toPlainText", () => {
    it("should be success withCodeLabel", () => {
      expect(rdb.toString({ withCodeLabel: true }))
        .toEqual(`n1         s1  d1         t1                  b1       ss1           ns1    
1 <yellow> 1   2024-08-01 2024-08-01 10:20:30 (BINARY) ["a1","b1"]   [1,2]  
2 <red>    2   2024-08-01 2024-08-01 10:20:30 (BINARY) ["a2","b2"]   [2,3]  
0 <green>      2024-08-01 2024-08-01 10:20:30 (BINARY) ["a3","b3"]   [3,4]  
1 <yellow> 4   2024-08-01 2024-08-01 10:20:30 (BINARY) ["a4","b4"]   [4,5]  
2 <red>    5   2024-08-01 2024-08-01 10:20:30 (BINARY) ["a5","b5"]   [5,6]  
...        ... ...        ...                 ...      ...           ...    
2 <red>    26  2024-08-01 2024-08-01 10:20:30 (BINARY) ["a26","b26"] [26,27]
0 <green>      2024-08-01 2024-08-01 10:20:30 (BINARY) ["a27","b27"] [27,28]
1 <yellow> 28  2024-08-01 2024-08-01 10:20:30 (BINARY) ["a28","b28"] [28,29]
2 <red>    29  2024-08-01 2024-08-01 10:20:30 (BINARY) ["a29","b29"] [29,30]
0 <green>      2024-08-01 2024-08-01 10:20:30 (BINARY) ["a30","b30"] [30,31]
`);
    });

    it("should be success binaryToHex", () => {
      expect(rdb.toString({ binaryToHex: true }))
        .toEqual(`n1  s1  d1         t1                  b1         ss1           ns1    
1   1   2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a1","b1"]   [1,2]  
2   2   2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a2","b2"]   [2,3]  
0       2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a3","b3"]   [3,4]  
1   4   2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a4","b4"]   [4,5]  
2   5   2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a5","b5"]   [5,6]  
... ... ...        ...                 ...        ...           ...    
2   26  2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a26","b26"] [26,27]
0       2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a27","b27"] [27,28]
1   28  2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a28","b28"] [28,29]
2   29  2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a29","b29"] [29,30]
0       2024-08-01 2024-08-01 10:20:30 B'000102f4 ["a30","b30"] [30,31]
`);
    });
    it("should be no records", () => {
      const rdb = ResultSetDataBuilder.createEmpty({
        noRecordsReason: "No records...",
      });
      expect(rdb.toString()).toBe("No records...");
      const rdb2 = ResultSetDataBuilder.createEmpty();
      expect(rdb2.toString()).toBe("No Records.");
    });
  });
  describe("toCsv", () => {
    it("should be success withCodeLabel, delimiter:comma", () => {
      expect(rdb.toCsv({ withCodeLabel: true }))
        .toEqual(`"n1","s1","d1","t1","b1","ss1","ns1"
"1 <yellow>","1","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a1"",""b1""]","[1,2]"
"2 <red>","2","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a2"",""b2""]","[2,3]"
"0 <green>","","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a3"",""b3""]","[3,4]"
"1 <yellow>","4","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a4"",""b4""]","[4,5]"
"2 <red>","5","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a5"",""b5""]","[5,6]"
...,...,...,...,...,...,...
"2 <red>","26","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a26"",""b26""]","[26,27]"
"0 <green>","","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a27"",""b27""]","[27,28]"
"1 <yellow>","28","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a28"",""b28""]","[28,29]"
"2 <red>","29","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a29"",""b29""]","[29,30]"
"0 <green>","","2024-08-01","2024-08-01 10:20:30","(BINARY)","[""a30"",""b30""]","[30,31]"
`);
    });
    it("should be success withCodeLabel, delimiter:tab", () => {
      expect(rdb.toCsv({ withCodeLabel: true, csv: { delimiter: "\t" } }))
        .toEqual(`"n1"\t"s1"\t"d1"\t"t1"\t"b1"\t"ss1"\t"ns1"
"1 <yellow>"\t"1"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a1"",""b1""]"\t"[1,2]"
"2 <red>"\t"2"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a2"",""b2""]"\t"[2,3]"
"0 <green>"\t""\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a3"",""b3""]"\t"[3,4]"
"1 <yellow>"\t"4"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a4"",""b4""]"\t"[4,5]"
"2 <red>"\t"5"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a5"",""b5""]"\t"[5,6]"
...\t...\t...\t...\t...\t...\t...
"2 <red>"\t"26"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a26"",""b26""]"\t"[26,27]"
"0 <green>"\t""\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a27"",""b27""]"\t"[27,28]"
"1 <yellow>"\t"28"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a28"",""b28""]"\t"[28,29]"
"2 <red>"\t"29"\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a29"",""b29""]"\t"[29,30]"
"0 <green>"\t""\t"2024-08-01"\t"2024-08-01 10:20:30"\t"(BINARY)"\t"[""a30"",""b30""]"\t"[30,31]"
`);
    });
    it("should be no records", () => {
      const rdb = ResultSetDataBuilder.createEmpty({
        noRecordsReason: "No records...",
      });
      expect(rdb.toCsv()).toBe("No records...");
      const rdb2 = ResultSetDataBuilder.createEmpty();
      expect(rdb2.toCsv()).toBe("No Records.");
    });
  });
  describe("toHtml", () => {
    it("should be success withCodeLabel", () => {
      expect(rdb.toHtml({ withCodeLabel: true }))
        .toEqual(`<div class="table-container">
<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
<thead>
  <tr class=""><th>n1</th><th>s1</th><th>d1</th><th>t1</th><th>b1</th><th>ss1</th><th>ns1</th></tr>
</thead>
<tbody>
  <tr class=""><td class="">1 <span class="tag is-info is-light">yellow</span></td><td class="">1</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a1&quot;,&quot;b1&quot;]</td><td class="">[1,2]</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">2</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a2&quot;,&quot;b2&quot;]</td><td class="">[2,3]</td></tr>
  <tr class=""><td class="">0 <span class="tag is-info is-light">green</span></td><td class=""><span class="tag is-light">NULL</span></td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a3&quot;,&quot;b3&quot;]</td><td class="">[3,4]</td></tr>
  <tr class=""><td class="">1 <span class="tag is-info is-light">yellow</span></td><td class="">4</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a4&quot;,&quot;b4&quot;]</td><td class="">[4,5]</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">5</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a5&quot;,&quot;b5&quot;]</td><td class="">[5,6]</td></tr>
  <tr class=""><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">26</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a26&quot;,&quot;b26&quot;]</td><td class="">[26,27]</td></tr>
  <tr class=""><td class="">0 <span class="tag is-info is-light">green</span></td><td class=""><span class="tag is-light">NULL</span></td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a27&quot;,&quot;b27&quot;]</td><td class="">[27,28]</td></tr>
  <tr class=""><td class="">1 <span class="tag is-info is-light">yellow</span></td><td class="">28</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a28&quot;,&quot;b28&quot;]</td><td class="">[28,29]</td></tr>
  <tr class=""><td class="">2 <span class="tag is-info is-light">red</span></td><td class="">29</td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a29&quot;,&quot;b29&quot;]</td><td class="">[29,30]</td></tr>
  <tr class=""><td class="">0 <span class="tag is-info is-light">green</span></td><td class=""><span class="tag is-light">NULL</span></td><td class="">2024-08-01</td><td class="">2024-08-01 10:20:30</td><td class="">(BINARY)</td><td class="">[&quot;a30&quot;,&quot;b30&quot;]</td><td class="">[30,31]</td></tr>
</tbody>
</table>
</div>
`);
    });
    it("should be no records", () => {
      const rdb = ResultSetDataBuilder.createEmpty({
        noRecordsReason: "No records...",
      });
      expect(rdb.toHtml()).toBe("<p>No records...</p>");
      const rdb2 = ResultSetDataBuilder.createEmpty();
      expect(rdb2.toHtml()).toBe("<p>No Records.</p>");
    });
  });

  describe("createRdhKeysOf", () => {
    it("should return an empty array for an empty input", () => {
      expect(createRdhKeysOf([])).toEqual([]);
    });

    it("should generate key info from a simple object array", () => {
      const list = [
        { id: 1, name: "foo", flag: true },
        { id: 2, name: "bar", flag: false },
      ];
      const keys = createRdhKeysOf(list);
      // Check key names
      expect(keys.map((k) => k.name)).toEqual(["id", "name", "flag"]);
      // Check types
      expect(keys.find((k) => k.name === "id")?.type).toBe(
        GeneralColumnType.NUMERIC
      );
      expect(keys.find((k) => k.name === "name")?.type).toBe(
        GeneralColumnType.TEXT
      );
      expect(keys.find((k) => k.name === "flag")?.type).toBe(
        GeneralColumnType.BOOLEAN
      );
    });

    it("should return UNKNOWN type if types are mixed", () => {
      const list = [{ value: 1 }, { value: "str" }];
      const keys = createRdhKeysOf(list);
      // Mixed types should result in UNKNOWN
      expect(keys[0].type).toBe(GeneralColumnType.UNKNOWN);
    });

    it("should infer type if null or undefined is mixed with a value", () => {
      const list = [{ value: null }, { value: 123 }, { value: undefined }];
      const keys = createRdhKeysOf(list);
      // Should infer NUMERIC
      expect(keys[0].type).toBe(GeneralColumnType.NUMERIC);
    });

    it("should return NULL type if all values are null or undefined", () => {
      const list = [{ value: null }, { value: undefined }];
      const keys = createRdhKeysOf(list);
      // All null/undefined should result in NULL type
      expect(keys[0].type).toBe(GeneralColumnType.NULL);
    });

    it("should detect DATE type", () => {
      const list = [
        { dt: new Date("2020-01-01") },
        { dt: new Date("2020-01-02") },
      ];
      const keys = createRdhKeysOf(list);
      // Should detect DATE type
      expect(keys[0].type).toBe(GeneralColumnType.DATE);
    });

    it("should infer types for multiple keys", () => {
      const list = [
        { a: 1, b: "x", c: true },
        { a: null, c: false },
        { a: 2, b: "y", c: false, dt: new Date("2020-01-02") },
      ];
      const keys = createRdhKeysOf(list);
      // Check key names and types
      expect(keys.map((k) => k.name)).toEqual(["a", "b", "c", "dt"]);
      expect(keys.find((k) => k.name === "a")?.type).toBe(
        GeneralColumnType.NUMERIC
      );
      expect(keys.find((k) => k.name === "b")?.type).toBe(
        GeneralColumnType.TEXT
      );
      expect(keys.find((k) => k.name === "c")?.type).toBe(
        GeneralColumnType.BOOLEAN
      );
      expect(keys.find((k) => k.name === "dt")?.type).toBe(
        GeneralColumnType.DATE
      );
    });
  });
});
