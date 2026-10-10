# Quidence · 数论 Project 题 v2（不用穷举，每步都有严谨证明）

日期：2026-10-09
定位：从高中打基础，到本科《初等数论》入门
数量：10 个 project，43 步，120 个作答字段（76 个数字、15 个单选、2 个多选、27 个说理）

---

## 一、这一版按什么标准写

1. **不用穷举。** 学生在任何一步都不需要：
   - 列表；
   - 逐个试；
   - 搜索答案；
   - 试除分解；
   - 靠"数出来"得到答案。

   **保留的计算**都是由定理指定的、步数很少的算法，例如：
   - 欧几里得算法的几次除法；
   - 反复平方；
   - 代入法；
   - 用乘法验证一个**题目给出的**分解；
   - 定理只留下一个候选数时，做一次除法（例如 2047 ÷ 23）。

2. **每一步都有完整证明。** JSON 里每个 step 新增 `referenceSolution`，内容是这一步的英文完整证明，不是只给答案。

3. **思路清楚。**
   - 每个项目新增英文 `approach`，标题是 "How to think about it"，可以直接放到网站上；
   - 另附中文"思路导引"，给你们和老师看；
   - 步骤按"先算一个具体例子 → 证明一般结论 → 用结论解决问题 → 看结论在哪里失效"的顺序排。

4. **写明依赖。** 每题的 `uses` 列出两类内容：
   - 用到了前面哪一题的结论；
   - 哪些定理是"默认成立、本组没有证明"的（见第五节的局限）。

## 二、和 v1 相比改了哪里

| 项目 | v1 里靠穷举或不够严谨的地方 | v2 的做法 |
|---|---|---|
| P1 欧几里得算法 | 原理只要求"解释"；最小公倍数是"求出来"的 | 先证明"(a, b) 与 (b, r) 的公因数完全相同"和终止性；多选题用"s 可行 ⇔ s \| 84"判断；用 1 = 2·11 − 3·7 证明 6468 最小 |
| P2 两个水壶 | 能量出哪些水量，靠试着倒水 | 证明通解；用"不变量"证明 1、2、4、5、7、8 L 不可能；一般规则用"ka 除以 b 的余数两两不同"证明 |
| P9 门票凑数 | 列出 1–30 的表；只是"检验"公式 | 按模 5 的余数分类，每一类只有一个"门槛"；用 ⌊7b/5⌋ 计数；完整证明 ab − a − b 和 (a − 1)(b − 1)/2 |
| P10 质数无穷多 | 求 30031 的最小质因数、分解 923（都是试除） | 分解由题目给出，只需乘法验证；证明"每个 N > 1 都有质因数"；4k + 3 的变式用"最小反例"证明 |
| P3 数位检验 | 只证明了模 9 的数位和；互换错误只看一个例子 | 两个检验都证明；一般地证明相邻互换让数值改变 9·10ʲ(u − v)；证明校验码能查出所有单个错误和相邻互换 |
| P4 孙子问题 | 第 1 步就是"Search, then notice a pattern" | 改用代入法；证明解在模 105 下唯一；证明孙子构造为什么对；完整证明一般判别法"有解 ⇔ gcd \| a − b" |
| P7 勾股数 | "数出斜边小于 30 的本原勾股数" | 证明公式 → 本原条件 → 模 4 奇偶 → **每个**本原勾股数都来自公式 → 用韦达定理求单位圆上的点 |
| P5 费马小定理 | 列出 7 的各次方的末位；定理直接给出；341 的结论靠"检查" | 由 7² ≡ −1 推出 7⁴ ≡ 1；用置换法证明费马小定理；用 1024 = 3·341 + 1 推出 2³⁴⁰ ≡ 1；分别模 11、模 31 计算再合并；另给出完全不用因数的反复平方验证 |
| P6 RSA | φ 直接给公式；解密直接硬算 | 用容斥原理计数得到 φ；用中国剩余定理解密；完整证明对**所有**消息都能解锁（包括 p \| m 的情况）；知道 φ(n) 就能解二次方程求出 p、q |
| P8 完全数 | 列出因数求和；求 2047 的最小质因数（试除） | 由唯一分解推出因数和公式；用"阶"的引理证明质因数 ≡ 1 (mod 2p)，于是 127 一句话就能证明是质数，2047 只需除一次；用 xˢ − 1 的因式分解证明"指数必须是质数" |

**举一个例子说明"不穷举"是怎么做到的。** v1 问"2⁷ − 1 = 127 是不是质数"时，学生只能用 2、3、5、7、11 逐个去除。v2 先证明一个引理：2ᵖ − 1 的质因数 q 都满足 q ≡ 1 (mod 2p)。证明用到"阶"和费马小定理。于是 127 的质因数至少是 15，而 √127 < 12。所以 127 一定是质数，一次试除都不用。

## 三、学习路线（建议顺序）

| 顺序 | 层级 | 编号 | 标题 | 步数 | 核心证明工具 |
|---|---|---|---|---|---|
| 1 | High-school foundation | nt-p01 | Square tiles and Euclid’s shortcut | 4 | 公因数保持引理；递减的非负整数序列必终止 |
| 2 | Bridge (high school to undergraduate) | nt-p02 | Two jugs and no measuring cup | 4 | 逆向代入；通解证明；不变量 |
| 3 | High-school foundation | nt-p09 | Ticket packs and the largest impossible order | 4 | 按余数分类的"门槛"；取整函数引理与配对 |
| 4 | High-school foundation | nt-p10 | Euclid’s argument for endless primes | 4 | 最小因数是质数；最小反例 |
| 5 | High-school foundation | nt-p03 | Why digit tests work | 4 | 10 ≡ 1 (mod 9)、10 ≡ −1 (mod 11)；变化量 9·10ʲ(u − v) |
| 6 | Bridge (high school to undergraduate) | nt-p04 | An ancient remainder puzzle | 4 | 代入法；互素因数之积整除；gcd 判别法 |
| 7 | Bridge (high school to undergraduate) | nt-p07 | Right triangles with whole-number sides | 5 | 模 4 奇偶；互素且乘积为平方 ⇒ 各为平方；韦达定理 |
| 8 | Intro undergraduate | nt-p05 | Last digits and a theorem that can be fooled | 5 | 置换法证明费马小定理；反复平方；逆否命题 |
| 9 | Intro undergraduate | nt-p06 | A toy public-key lock | 5 | 容斥原理；扩展欧几里得；中国剩余定理 |
| 10 | Intro undergraduate | nt-p08 | Perfect numbers and a prime that isn’t | 4 | 因数和公式；阶的引理；√n 界限；xˢ − 1 分解 |

---

## 四、10 个项目（英文为网站原文）


### 项目 1 · nt-p01 · Square tiles and Euclid’s shortcut

- **层级：** High-school foundation · medium · Divisibility and the greatest common divisor
- **经典来源：** 欧几里得算法（《几何原本》第七卷命题 1–2，约公元前 300 年）；gcd × lcm = 两数之积。
- **思路导引（中文，给老师和设计者）：** 核心想法：不去列出 924 和 588 的所有因数，而是证明"(a, b) 和 (b, a 除以 b 的余数) 有完全相同的公因数"。这样问题每一步都变小，最后一个非零余数就是最大公因数，而且顺带证明了"所有公因数都整除 gcd"。第 3 步的多选题和第 4 步的最小公倍数都直接用这两个结论推出，不需要试数。常见卡点：学生会说"余数越来越小所以会停"，但没有说清"余数是非负整数"这个前提。
- **用到的结论（Uses）：** Division with remainder; well-ordering (a decreasing sequence of nonnegative integers stops).
- **诊断点：** 证明"余数步骤不改变公因数"；终止性需要"非负整数严格递减"；用定理而不是试数来做多选；最小公倍数的证明用到贝祖等式。
- **图形 / 互动建议：** 矩形切正方形的动画：924 × 588 先切掉一个 588 × 588，再在剩下的长条里继续切。

**Prompt**

> An invented community center wants to cover a rectangular floor 924 cm by 588 cm with identical square tiles, without cutting any tile. Each tile side must be a whole number of centimeters, and the center wants the largest possible tiles. Do not list all divisors; use the reasoning below.

**How to think about it（`approach`，可直接放网站）**

> Do not search for divisors. Prove that (a, b) and (b, r) have the same common divisors when a = qb + r, so each division keeps the answer and makes the numbers smaller. The last nonzero remainder is the gcd, and every common divisor divides it. The tile count and the lcm follow from these two facts.

#### 1 · Run the algorithm

> Divide with remainder: 924 = 1 × 588 + 336, then divide 588 by 336, and continue until the remainder is 0. Give the last nonzero remainder and the number of divisions.

字段：`gcd`, `divisions`

**Reference proof（`referenceSolution`）**

> The divisions are
>
> 924 = 1·588 + 336
>
> 588 = 1·336 + 252
>
> 336 = 1·252 + 84
>
> 252 = 3·84 + 0.
>
> Four divisions are needed, and the last nonzero remainder is 84. Step 2 proves that this number is gcd(924, 588).

#### 2 · Prove why it works

> Let a = qb + r with whole numbers q and r, where 0 ≤ r < b. Prove that a and b have exactly the same common divisors as b and r. Then explain why the algorithm stops and why the last nonzero remainder is the greatest common divisor.

字段：`why`

**Reference proof（`referenceSolution`）**

> Lemma. If a = qb + r, then the common divisors of a and b are exactly the common divisors of b and r.
>
> Proof. Suppose d | a and d | b. Then d divides a − qb = r, so d is a common divisor of b and r. Conversely, suppose d | b and d | r. Then d divides qb + r = a, so d is a common divisor of a and b. ∎
>
> Termination. Each remainder satisfies 0 ≤ r < b, so the remainders form a strictly decreasing sequence of nonnegative integers: 336 > 252 > 84 > 0. A strictly decreasing sequence of nonnegative integers cannot go on forever, so some remainder equals 0.
>
> Conclusion. Applying the lemma at each division, the common divisors of (924, 588), (588, 336), (336, 252), (252, 84) and (84, 0) are all the same set. The common divisors of 84 and 0 are exactly the divisors of 84, because every integer divides 0. So the common divisors of 924 and 588 are exactly the divisors of 84, and the greatest of them is 84. In particular, every common divisor of 924 and 588 divides 84.
>
> In general, if the first remainder is already 0, then b | a and gcd(a, b) = b. Otherwise, if the nonzero remainders are r₁ > r₂ > ⋯ > rₙ, the lemma at each division shows that the common divisors of a and b are exactly the divisors of rₙ, so rₙ = gcd(a, b), and every common divisor of a and b divides it.

#### 3 · Count the tiles

> A square tile of side s covers the floor exactly if and only if s divides both 924 and 588. Use the largest such s. How many tiles fit along each side, and how many are needed? Then, using Step 2 instead of trial and error, select all the other tile sides in the list that also cover the floor exactly.

字段：`along924`, `along588`, `total`, `otherSides`

**Reference proof（`referenceSolution`）**

> A row of tiles of side s fills 924 cm exactly when s | 924, and a column fills 588 cm exactly when s | 588. So the possible sides are the common divisors of 924 and 588, and the largest is gcd(924, 588) = 84.
>
> Then 924 = 84 × 11 and 588 = 84 × 7, so 11 tiles fit along one side, 7 along the other, and 11 × 7 = 77 tiles are needed.
>
> By Step 2, a side s works if and only if s divides 84. Since 84 = 12 × 7 = 21 × 4 = 28 × 3 = 42 × 2, the sides 12, 21, 28 and 42 cm work. 56 does not divide 84 (84 = 56 + 28), so 56 cm does not work.

#### 4 · From gcd to lcm

> A border pattern repeats every 924 cm and another every 588 cm. Prove that the shortest length where both patterns end together is 924 × 588 / 84. Use 924 = 84 × 11, 588 = 84 × 7, and the identity 1 = 2 × 11 − 3 × 7.

字段：`lcm`, `identity`, `lcmProof`

**Reference proof（`referenceSolution`）**

> A length L works exactly when L is a common multiple of 924 and 588. Write 924 = 84·11 and 588 = 84·7.
>
> Since 924 | L, write L = 84·11·t for a positive integer t. Since 588 | L, we have 84·7 | 84·11·t, so 7 | 11t.
>
> Claim: 7 | t. Using 1 = 2·11 − 3·7, multiply by t: t = 2·(11t) − 3·7·t. Both terms on the right are multiples of 7 (the first because 7 | 11t), so 7 | t.
>
> So t ≥ 7, and t = 7 works, since then L = 84·11·7 = 924·7 = 588·11. The least common multiple is 84·77 = 6468.
>
> Check: gcd × lcm = 84 × 6468 = 543,312 = 924 × 588. The same argument works for any a = g·a′ and b = g·b′ as soon as we can write 1 = x·a′ + y·b′ with integers x and y. Bézout’s identity (a later project; assumed in general from nt-p04 on) gives such x and y when g = gcd(a, b), and then gcd(a, b)·lcm(a, b) = ab in general.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `gcd` | Last nonzero remainder, gcd(924, 588) | number | **84** | 接受：`84`；应判错：`42`, `12`, `336` |
| `divisions` | Number of divisions | number | **4** | 接受：`4`；应判错：`3`, `5` |
| `why` | Prove why the algorithm works | reason | （人工审阅） | 审阅要点：If d divides a and b, it divides r = a − qb; if d divides b and r, it divides a = qb + r. So the two pairs have the same common divisors. / The remainders are nonnegative integers that strictly decrease, so one of them is 0; the last nonzero remainder is the gcd, and every common divisor divides it.<br>追问：Where in your proof did you use that each remainder is less than the divisor? |
| `along924` | Tiles along the 924 cm side | number | **11** | 接受：`11`；应判错：`7` |
| `along588` | Tiles along the 588 cm side | number | **7** | 接受：`7`；应判错：`11` |
| `total` | Total tiles | number | **77** | 接受：`77`；应判错：`18`, `154` |
| `otherSides` | Other tile sides that also work | multi | `21`, `28`, `42`, `12` | **✓ 21 cm**<br>**✓ 28 cm**<br>**✓ 42 cm**<br>✗ 56 cm<br>**✓ 12 cm** |
| `lcm` | Shortest common length, lcm(924, 588) (cm) | number | **6468** | 接受：`6468`；应判错：`543312`, `84`, `3234` |
| `identity` | Which identity does your result confirm? | choice | `prod` | **✓ gcd × lcm = 924 × 588**<br>✗ gcd + lcm = 924 + 588<br>✗ gcd and lcm are unrelated |
| `lcmProof` | Prove that 6468 is the least common multiple | reason | （人工审阅） | 审阅要点：Write a common multiple as L = 84·11·t; then 7 | 11t. / Use 1 = 2·11 − 3·7 to show 7 | t, so t ≥ 7; t = 7 works.<br>追问：Why would the argument fail if 11 and 7 had a common factor? |

**Reference solution（总结）：** gcd(924, 588) = 84 after four divisions. The common divisors of 924 and 588 are exactly the divisors of 84, so the largest tile is 84 cm (77 tiles), and 12, 21, 28 and 42 cm also work. lcm = 924·588/84 = 6468.

**Next check：** Prove that if Euclid’s algorithm on a and b takes k divisions, then b is at least the (k + 1)-th Fibonacci number.


### 项目 2 · nt-p02 · Two jugs and no measuring cup

- **层级：** Bridge (high school to undergraduate) · medium · Linear Diophantine equations
- **经典来源：** 贝祖等式（Bézout，18 世纪）与扩展欧几里得算法；"两个水壶量水"是流传很广的经典趣题，这里换了容量和情境。
- **思路导引（中文，给老师和设计者）：** 核心想法有两个。第一，"能量出 1 升"等价于找整数 x、y 使 7x + 11y = 1，扩展欧几里得算法把这个解"倒推"出来，并且给出一个具体的倒水顺序。第二，"量不出 4 升"要用不变量来证明：不管怎么操作，两个壶里的水量永远是 3 的倍数。这样学生不用尝试所有倒法，就能同时证明"能"和"不能"。常见卡点：求通解时，学生只验证 (x + 11k, y − 7k) 是解，却没有证明"所有解都长这样"。
- **用到的结论（Uses）：** Euclidean algorithm (nt-p01); induction on the number of moves; if m | kn and gcd(m, n) = 1 then m | k (proved for 7 and 11 in Step 2, assumed in general in Step 4).
- **诊断点：** 扩展欧几里得的倒推；"所有解"需要双向证明；用不变量证明"做不到"；从具体例子到一般规律。
- **图形 / 互动建议：** 两个水壶的交互动画：倒水、装满、倒空，显示两壶当前水量，并标出每一步对应的 7x + 11y。

**Prompt**

> At an invented science fair, you have only two unmarked jugs that hold 7 L and 11 L, plus a large tank of water. You may fill a jug, empty a jug, or pour from one jug into the other until the receiving jug is full or the pouring jug is empty. You need exactly 1 L.

**How to think about it（`approach`，可直接放网站）**

> Run the Euclidean algorithm backward to write 1 = 2·11 − 3·7, and read it as fills and empties. Then prove what every solution looks like. For jugs that cannot make some amounts, find a quantity that no move can change: every amount stays a multiple of the gcd.

#### 1 · Run Euclid backward

> Find gcd(7, 11) with the Euclidean algorithm. Then substitute backward to find integers x and y with 7x + 11y = 1, with x negative and as close to 0 as possible. Turn your x and y into a fill-and-pour sequence.

字段：`g`, `x`, `y`, `pour`

**Reference proof（`referenceSolution`）**

> Euclid: 11 = 1·7 + 4, 7 = 1·4 + 3, 4 = 1·3 + 1, 3 = 3·1 + 0, so gcd(7, 11) = 1.
>
> Back-substitution, one remainder at a time:
>
> 1 = 4 − 3
>
> = 4 − (7 − 4) = 2·4 − 7
>
> = 2·(11 − 7) − 7 = 2·11 − 3·7.
>
> So x = −3 and y = 2. By Step 2, every solution has x = −3 + 11k, so no other negative x is closer to 0.
>
> Meaning: pour in 11 L twice (+22 L) and pour out 7 L three times (−21 L), leaving 1 L. A sequence (amounts written as (7 L jug, 11 L jug)):
>
> fill the 11 L jug (0, 11); pour into the 7 L jug (7, 4); empty the 7 L jug (0, 4); pour (4, 0); fill the 11 L jug (4, 11); pour until the 7 L jug is full (7, 8); empty the 7 L jug (0, 8); pour (7, 1); empty the 7 L jug (0, 1).
>
> The 11 L jug now holds 1 L. The 11 L jug was filled twice and the 7 L jug was emptied three times, matching y = 2 and x = −3: 2·11 − 3·7 = 1.

#### 2 · Find every solution

> Prove that (x, y) solves 7x + 11y = 1 if and only if x = −3 + 11k and y = 2 − 7k for some integer k. Then give the solution with the smallest positive x.

字段：`xpos`, `ypos`, `pattern`, `allSolutions`

**Reference proof（`referenceSolution`）**

> If part. 7(−3 + 11k) + 11(2 − 7k) = −21 + 77k + 22 − 77k = 1.
>
> Only-if part. Let 7x + 11y = 1. Subtract 7(−3) + 11(2) = 1 to get 7(x + 3) = 11(2 − y). So 11 divides 7(x + 3).
>
> Claim: 11 divides x + 3. Multiply 1 = 2·11 − 3·7 by (x + 3): x + 3 = 2·11·(x + 3) − 3·7(x + 3). The first term is a multiple of 11, and 7(x + 3) is a multiple of 11, so x + 3 is a multiple of 11. Write x + 3 = 11k. Then 7·11k = 11(2 − y), so 2 − y = 7k and y = 2 − 7k. ∎
>
> The smallest positive x: −3 + 11k > 0 exactly when k ≥ 1, so k = 1 gives x = 8 and y = −5. Check: 56 − 55 = 1.

#### 3 · Prove that some targets are impossible

> Now the jugs hold 6 L and 15 L. Find gcd(6, 15). Prove that after any sequence of moves, each jug holds a multiple of 3 liters. Then select every amount from 1 L to 9 L that can be left in the 15 L jug, and give a sequence for each one you select.

字段：`g2`, `amounts`, `invariant`

**Reference proof（`referenceSolution`）**

> gcd(6, 15) = 3, since 15 = 2·6 + 3 and 6 = 2·3.
>
> Invariant. Claim: after every move, both amounts are multiples of 3. At the start both are 0. Suppose before a move the amounts u (6 L jug) and v (15 L jug) are multiples of 3.
>
> • Filling sets an amount to 6 or 15, both multiples of 3.
>
> • Emptying sets an amount to 0.
>
> • Pouring from one jug into the other moves t liters, where t is the smaller of the amount in the pouring jug and the free space in the receiving jug. Both are multiples of 3 (a capacity minus a multiple of 3), so t is a multiple of 3, and both new amounts stay multiples of 3.
>
> By induction on the number of moves, the claim always holds. So 1, 2, 4, 5, 7 and 8 L are impossible.
>
> The multiples of 3 are possible:
>
> 6 L: fill the 6 L jug and pour it into the 15 L jug.
>
> 9 L: fill the 15 L jug and pour into the 6 L jug until it is full; 9 L remain.
>
> 3 L: continue from 9 L: empty the 6 L jug and pour again; 15 − 6 − 6 = 3 L remain.

#### 4 · State the general rule

> For jugs of a and b liters with a < b, explain which whole-liter amounts can be left in the larger jug, and why. Connect your answer to gcd(a, b).

字段：`rule`

**Reference proof（`referenceSolution`）**

> Let g = gcd(a, b), with a < b.
>
> Only multiples of g. The Step 3 invariant works with 3 replaced by g: capacities a and b are multiples of g, so every fill, empty and pour keeps both amounts multiples of g.
>
> Every multiple of g up to b. Fill the a-liter jug and pour it into the b-liter jug, emptying the b-liter jug whenever it becomes full, and repeat. After the small jug has been poured out k times, a total of ka liters has gone into the large jug and a multiple of b has been thrown away, so the large jug holds the remainder r_k of ka divided by b.
>
> First, gcd(a/g, b/g) = 1: if d > 0 divides both a/g and b/g, then dg divides a and b, so dg ≤ g and d = 1.
>
> For k = 0, 1, …, b/g − 1 the remainders r_k are all different: if ka and k′a leave the same remainder on division by b, then b | (k − k′)a, so (b/g) | (k − k′)(a/g). Since gcd(b/g, a/g) = 1, (b/g) | k − k′, and since |k − k′| < b/g, k = k′. They are b/g different multiples of g between 0 and b − g, so they are exactly 0, g, 2g, …, b − g. Together with b itself (fill the large jug), every multiple of g up to b can be left in the large jug.
>
> So the amounts that can be left in the larger jug are exactly the multiples of gcd(a, b) from 0 to b. For 7 L and 11 L, g = 1 and every whole amount up to 11 L is possible.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `g` | gcd(7, 11) | number | **1** | 接受：`1`；应判错：`7`, `77` |
| `x` | x (negative, closest to 0) | number | **-3** | 接受：`-3`；应判错：`3`, `8`, `-14` |
| `y` | y | number | **2** | 接受：`2`；应判错：`-2`, `-5` |
| `pour` | Give a fill-and-pour sequence | reason | （人工审阅） | 审阅要点：Use 2·11 − 3·7 = 1: fill the 11 L jug twice and pour from it into the 7 L jug, emptying the 7 L jug whenever it is full. The 7 L jug becomes full three times (3·7 = 21 = 22 − 1), and 1 L is left in the 11 L jug. / Show the amounts after each move, using only moves the rules allow.<br>追问：How do the number of times you fill the 11 L jug and the number of times the 7 L jug becomes full match y and x? |
| `xpos` | Smallest positive x | number | **8** | 接受：`8`；应判错：`3`, `11` |
| `ypos` | Matching y | number | **-5** | 接受：`-5`；应判错：`5`, `2` |
| `pattern` | How are the solutions related? | choice | `steps` | **✓ x changes by multiples of 11 while y changes by the same multiples of 7 in the opposite direction**<br>✗ x and y both change by 1<br>✗ There is only one solution |
| `allSolutions` | Prove that you found every solution | reason | （人工审阅） | 审阅要点：Subtract the known solution: 7(x + 3) = 11(2 − y), so 11 | 7(x + 3). / Use 1 = 2·11 − 3·7 (or gcd(7, 11) = 1) to conclude 11 | x + 3, then solve for y.<br>追问：Why is it not enough to check that (−3 + 11k, 2 − 7k) satisfies the equation? |
| `g2` | gcd(6, 15) | number | **3** | 接受：`3`；应判错：`1`, `30` |
| `amounts` | Amounts you can leave in the 15 L jug | multi | `3`, `6`, `9` | ✗ 1 L<br>✗ 2 L<br>**✓ 3 L**<br>✗ 4 L<br>✗ 5 L<br>**✓ 6 L**<br>✗ 7 L<br>✗ 8 L<br>**✓ 9 L** |
| `invariant` | Prove the multiple-of-3 invariant | reason | （人工审阅） | 审阅要点：State the claim for the amounts in both jugs and check the starting state. / Check each kind of move: fill, empty, pour (the poured amount is a multiple of 3).<br>追问：Why does an invariant prove impossibility without trying every sequence? |
| `rule` | State and justify the general rule | reason | （人工审阅） | 审阅要点：Every measurable amount is a multiple of gcd(a, b) (invariant). / Every multiple of gcd(a, b) up to b can be left in the larger jug (the pouring pattern: the remainders of ka on division by b are different for k = 0, …, b/g − 1).<br>追问：With jugs of 9 L and 14 L, which amounts up to 14 L can you leave in the larger jug? |

**Reference solution（总结）：** gcd(7, 11) = 1 and 1 = 2·11 − 3·7, so 1 L can be measured. All solutions are (−3 + 11k, 2 − 7k). With 6 L and 15 L jugs every amount stays a multiple of 3, and 3, 6 and 9 L are achievable.

**Next check：** Prove Bézout’s identity in general: for any positive integers a and b there are integers x and y with ax + by = gcd(a, b).


### 项目 3 · nt-p09 · Ticket packs and the largest impossible order

- **层级：** High-school foundation · medium · Linear combinations with nonnegative coefficients
- **经典来源：** 西尔维斯特（Sylvester，1884 年）的"硬币问题"结论：两种面额 a、b 互素时，不能凑出的最大数是 ab − a − b，共有 (a − 1)(b − 1)/2 个。
- **思路导引（中文，给老师和设计者）：** 核心想法：不要从 1 一个个试到 30，而是按"除以 5 的余数"把所有人数分成 5 类。每一类里，只要用到的 7 张包数 b 确定了（b 只能是 0–4），能买的人数就是"从 7b 开始，每次加 5"。这样每一类都有一个"门槛"，门槛以下买不了，门槛以上全都能买。最大的门槛是 28，所以最大的买不了的数是 28 − 5 = 23；每类买不了的个数也能直接算出来，不需要列表。最后一步把同样的推理推广到任意互素的 a、b。
- **用到的结论（Uses）：** Division with remainder; if a | bj and gcd(a, b) = 1 then a | j (assumed); a floor-function lemma (proved in Step 3).
- **诊断点：** 按余数分类（同余类）代替列表；"门槛"论证；用取整函数计数；推广时找出定理需要的条件（互素）。
- **图形 / 互动建议：** 5 行的格子图：每一行是一个"除以 5 的余数"类，门槛 7b 之前的格子标灰。

**Prompt**

> An invented museum sells tickets only in packs of 5 and packs of 7. A group can buy any number of each kind of pack, including zero, and must buy exactly as many tickets as people. Work with remainders, not with a list of all sizes.

**How to think about it（`approach`，可直接放网站）**

> Sort sizes by their remainder mod 5. Adding a 5-pack keeps the remainder, so each class has one threshold: the smallest size in that class made with 7-packs only. Every size at or above the threshold works, and every size below it fails. The largest impossible size and the count both follow from the thresholds, with no list.

#### 1 · Sort sizes by their remainder mod 5

> The numbers 7b for b = 0, 1, 2, 3, 4 are 0, 7, 14, 21, 28. Show that they leave five different remainders when divided by 5. Then prove: a size n can be bought exactly when n ≥ 7b, where b is the one value in {0, 1, 2, 3, 4} with 7b ≡ n (mod 5). Give the smallest size that can be bought among sizes leaving remainder 3, and among sizes leaving remainder 1.

字段：`thr3`, `thr1`, `classProof`

**Reference proof（`referenceSolution`）**

> Remainders: 0, 7, 14, 21, 28 leave 0, 2, 4, 1, 3 when divided by 5, which are all different. So for each size n there is exactly one b in {0, …, 4} with 7b ≡ n (mod 5); call it bₙ.
>
> Claim: n = 5x + 7y has a solution with whole numbers x, y ≥ 0 if and only if n ≥ 7bₙ.
>
> Proof. (⇐) If n ≥ 7bₙ, then n − 7bₙ is a nonnegative multiple of 5, say 5x, so n = 5x + 7bₙ. (⇒) Suppose n = 5x + 7y with x, y ≥ 0. Divide y by 5: y = 5s + y′ with 0 ≤ y′ ≤ 4. Then n = 5(x + 7s) + 7y′, so 7y′ ≡ n (mod 5), which forces y′ = bₙ. Hence n = 5(x + 7s) + 7bₙ ≥ 7bₙ. ∎
>
> Sizes with remainder 3 have bₙ = 4, so the smallest one that can be bought is 28. Sizes with remainder 1 have bₙ = 3, so the smallest is 21.

#### 2 · Find the largest impossible size

> Use Step 1 to find the largest size that cannot be bought and the smallest N such that every size from N on can be bought. Prove both.

字段：`largest`, `runStart`

**Reference proof（`referenceSolution`）**

> In the class with bₙ = b, the impossible sizes are exactly the positive numbers below 7b in that class, and the largest is 7b − 5. The largest threshold is 7·4 = 28, so the largest impossible size is 28 − 5 = 23.
>
> Every n ≥ 24 can be bought: if bₙ ≤ 3, then 7bₙ ≤ 21 < n; if bₙ = 4, then n ≡ 3 (mod 5) and n ≥ 24 forces n ≥ 28 = 7bₙ. In both cases Step 1 applies. Since 23 is impossible, 24 is the smallest N with every size from N on possible.

#### 3 · Count the impossible sizes without listing them

> In the class with threshold 7b (b = 1, 2, 3, 4), count the positive sizes below 7b that leave the same remainder as 7b. Add the four counts.

字段：`howMany`

**Reference proof（`referenceSolution`）**

> In the class with threshold 7b, the impossible sizes are 7b − 5, 7b − 10, …, as long as they stay positive: 7b − 5j > 0 for j = 1, 2, …, ⌊7b/5⌋ (7b/5 is not a whole number for b = 1, …, 4, since 5 ∤ 7b).
>
> Counts: b = 1: ⌊7/5⌋ = 1; b = 2: ⌊14/5⌋ = 2; b = 3: ⌊21/5⌋ = 4; b = 4: ⌊28/5⌋ = 5. The class b = 0 (multiples of 5) has none.
>
> Total: 1 + 2 + 4 + 5 = 12 impossible sizes.
>
> Lemma. If N is an integer and x is not, then ⌊x⌋ + ⌊N − x⌋ = N − 1. Proof: write x = k + f with k = ⌊x⌋ and 0 < f < 1; then N − x = (N − k − 1) + (1 − f) with 0 < 1 − f < 1, so ⌊N − x⌋ = N − k − 1. ∎
>
> Pairing gives the same total: ⌊7b/5⌋ + ⌊7(5 − b)/5⌋ = ⌊7b/5⌋ + ⌊7 − 7b/5⌋ = 6, because 7b/5 is not an integer. The pairs (b = 1, 4) and (b = 2, 3) give 6 + 6 = 12 = (5 − 1)(7 − 1)/2.

#### 4 · Generalize, and see where it breaks

> For coprime pack sizes a, b ≥ 2, repeat Steps 1–3 to prove that the largest impossible size is ab − a − b and that there are (a − 1)(b − 1)/2 impossible sizes. Apply the result to packs of 3 and 8. Then decide whether packs of 6 and 9 have a largest impossible size.

字段：`largest38`, `count38`, `six9`, `general`

**Reference proof（`referenceSolution`）**

> General proof (gcd(a, b) = 1, a, b ≥ 2). The numbers b·j for j = 0, 1, …, a − 1 leave different remainders mod a: if bj ≡ bj′ (mod a), then a | b(j − j′), and since gcd(a, b) = 1 this gives a | j − j′; since |j − j′| < a, j = j′. These are a numbers with a different remainders, and there are only a possible remainders, so each remainder occurs exactly once. So each class mod a has exactly one threshold b·j, and as in Step 1 the sizes in that class that can be bought are exactly those ≥ b·j. The largest threshold is b(a − 1), so the largest impossible size is b(a − 1) − a = ab − a − b. The class with threshold bj contains ⌊bj/a⌋ impossible sizes, because bj/a is not an integer when 1 ≤ j ≤ a − 1 (a ∤ bj since gcd(a, b) = 1 and 0 < j < a). By the lemma in Step 3 (with N = b and x = bj/a), ⌊bj/a⌋ + ⌊b(a − j)/a⌋ = ⌊bj/a⌋ + ⌊b − bj/a⌋ = b − 1. Adding this identity over j = 1, …, a − 1 counts every class twice, so twice the total is (a − 1)(b − 1), and the total is (a − 1)(b − 1)/2.
>
> Packs of 3 and 8: 24 − 3 − 8 = 13 and 2·7/2 = 7.
>
> Packs of 6 and 9: every purchase is 6x + 9y = 3(2x + 3y), a multiple of 3. So every size that is not a multiple of 3 (40, 41, 43, …) is impossible, and there is no largest impossible size. The proof above needed gcd(a, b) = 1.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `thr3` | Smallest possible size with remainder 3 (mod 5) | number | **28** | 接受：`28`；应判错：`3`, `23`, `8` |
| `thr1` | Smallest possible size with remainder 1 (mod 5) | number | **21** | 接受：`21`；应判错：`1`, `6`, `16` |
| `classProof` | Prove the residue-class criterion | reason | （人工审阅） | 审阅要点：Show that 0, 7, 14, 21, 28 have different remainders mod 5. / If n = 5x + 7y, reduce y mod 5 to show n ≥ 7bₙ; conversely, n − 7bₙ is a nonnegative multiple of 5.<br>追问：Why does it matter that the five remainders are all different? |
| `largest` | Largest impossible size (5 and 7) | number | **23** | 接受：`23`；应判错：`35`, `18`, `28` |
| `runStart` | Smallest N with every size from N on possible | number | **24** | 接受：`24`；应判错：`23`, `28`, `36` |
| `howMany` | Number of impossible sizes (5 and 7) | number | **12** | 接受：`12`；应判错：`11`, `13`, `23` |
| `largest38` | Largest impossible size for packs of 3 and 8 | number | **13** | 接受：`13`；应判错：`24`, `11` |
| `count38` | Number of impossible sizes for packs of 3 and 8 | number | **7** | 接受：`7`；应判错：`14`, `8` |
| `six9` | Is there a largest impossible size for packs of 6 and 9? | choice | `no` | **✓ No; every size that is not a multiple of 3 is impossible, so there are infinitely many**<br>✗ Yes; it is 6 × 9 − 6 − 9 = 39<br>✗ Yes; it is 5 |
| `general` | Prove the general result | reason | （人工审阅） | 审阅要点：Show that b·0, b·1, …, b·(a − 1) leave different remainders mod a, using gcd(a, b) = 1. / Conclude that the largest impossible size is b(a − 1) − a, and count with the pairing ⌊bj/a⌋ + ⌊b(a − j)/a⌋ = b − 1.<br>追问：Which step of your proof fails for packs of 6 and 9? |

**Reference solution（总结）：** Sorting sizes by remainder mod 5, each class has a threshold 7b (b = 0, …, 4) above which every size can be bought. The top threshold is 28, so 23 is the largest impossible size and every size from 24 on is possible. Counting below thresholds gives 1 + 2 + 4 + 5 = 12 impossible sizes. In general the answers are ab − a − b and (a − 1)(b − 1)/2 when gcd(a, b) = 1.

**Next check：** Prove that for coprime a and b, a size n with 0 ≤ n ≤ ab − a − b can be bought if and only if ab − a − b − n cannot.


### 项目 4 · nt-p10 · Euclid’s argument for endless primes

- **层级：** High-school foundation · medium · Prime numbers
- **经典来源：** 欧几里得证明质数有无穷多个（《几何原本》第九卷命题 20）；30031 = 59 × 509 是常用来说明"乘积加一不一定是质数"的例子；4k + 3 型质数无穷多是同一思路的变式。
- **思路导引（中文，给老师和设计者）：** 核心想法：不需要知道 Q 是不是质数，也不需要把 Q 分解出来。只要证明两件事：(1) 任何大于 1 的整数都有质因数；(2) 名单上的质数都不整除 Q（因为余数都是 1）。所以 Q 的质因数一定不在名单上。题目里直接给出 30031 = 59 × 509，学生只需用乘法核对，这个反例的作用是说明"Q 本身不一定是质数"。第 4 步把同样的推理用到 4k + 3 型质数，关键是"几个 4k + 1 型的数相乘，还是 4k + 1 型"。
- **用到的结论（Uses）：** Well-ordering (least divisor greater than 1, smallest counterexample); remainders.
- **诊断点：** 反证法的结构；"Q 是质数"与"Q 有新的质因数"的区别；"每个大于 1 的整数都有质因数"需要证明；模 4 的乘法封闭性。
- **图形 / 互动建议：** 可选："乘积加一"计算器，输入一组质数后显示 Q 和它除以每个质数的余数。

**Prompt**

> Suppose someone claims to have a complete, finite list of all primes. Euclid’s argument shows how to find a prime that is missing from any such list, without factoring anything.

**How to think about it（`approach`，可直接放网站）**

> Multiply the primes on a list and add 1. The result leaves remainder 1 on division by each listed prime, so its prime factors are new. Prove that every number above 1 has a prime factor, and the argument is complete. Working with remainders mod 4 gives infinitely many primes of the form 4k + 3.

#### 1 · Build Q and find its remainders

> For the list 2, 3, 5, 7, 11, 13, compute Q = 2 × 3 × 5 × 7 × 11 × 13 + 1. Prove that Q leaves remainder 1 when divided by any prime on the list.

字段：`q2`, `rem`

**Reference proof（`referenceSolution`）**

> Q = 30030 + 1 = 30031. For any prime p on the list, the product 2·3·5·7·11·13 is p times a whole number, say pk. Then Q = pk + 1 with 0 ≤ 1 < p, so the remainder is 1. In particular, no prime on the list divides Q.

#### 2 · Is Q prime?

> Check by multiplication that 59 × 509 = 30031. What does the argument actually guarantee?

字段：`prodCheck`, `guarantee`

**Reference proof（`referenceSolution`）**

> 59 × 509 = 59 × 500 + 59 × 9 = 29500 + 531 = 30031. So Q is not prime. This does not break the argument: by Step 1, no listed prime divides Q, so every prime factor of Q is missing from the list. The argument guarantees a prime missing from the list, not that Q itself is prime.

#### 3 · Write the complete proof

> Prove that every integer N > 1 has a prime factor. Then prove that there are infinitely many primes.

字段：`proof`

**Reference proof（`referenceSolution`）**

> Lemma. Every integer N > 1 has a prime factor.
>
> Proof. The set of divisors of N that are greater than 1 is not empty (it contains N), so it has a least element d. If d were not prime, d = rs with 1 < r < d, and r would be a divisor of N greater than 1 and smaller than d, a contradiction. So d is prime. ∎
>
> Theorem. There are infinitely many primes.
>
> Proof. Let p₁, …, pₖ be any finite list of primes and Q = p₁p₂⋯pₖ + 1. Then Q > 1, so by the lemma Q has a prime factor p. If p were some pᵢ, then p would divide both Q and p₁⋯pₖ, hence their difference 1, which is impossible. So p is a prime not on the list. Since every finite list misses a prime, there are infinitely many primes. ∎

#### 4 · A variation for primes of the form 4k + 3

> Let Q = 4 × (3 × 7 × 11) − 1. Compute Q and its remainder mod 4. Prove that Q must have a prime factor of the form 4k + 3 that is not 3, 7 or 11. Then use the given prime factorization Q = 13 × 71 (13 and 71 are prime) to name a prime factor of Q of the form 4k + 3 that is not 3, 7 or 11.

字段：`q3`, `mod4`, `f3`, `variation`

**Reference proof（`referenceSolution`）**

> Q = 4·231 − 1 = 923, and 923 = 4·230 + 3, so Q ≡ 3 (mod 4).
>
> Lemma. If x ≡ 1 and y ≡ 1 (mod 4), then xy ≡ 1 (mod 4). Proof: (4s + 1)(4t + 1) = 4(4st + s + t) + 1.
>
> Claim. Every integer N > 1 with N ≡ 3 (mod 4) has a prime factor ≡ 3 (mod 4).
>
> Proof. Suppose not, and let N be the smallest counterexample (well-ordering). N is not prime, since a prime N ≡ 3 would be its own such factor. So N = rs with 1 < r, s < N. N is odd, so r and s are odd, hence each is ≡ 1 or ≡ 3 (mod 4). By the lemma they are not both ≡ 1, so one of them, say r, is ≡ 3 (mod 4). Since 1 < r < N, r is not a counterexample, so r has a prime factor ≡ 3 (mod 4), and that prime also divides N. This contradicts the choice of N. ∎
>
> By the claim, Q has a prime factor q ≡ 3 (mod 4).
>
> q is not 3, 7 or 11: for each such p, 4·231 is a multiple of p, so Q = 4·231 − 1 leaves remainder p − 1 ≠ 0.
>
> With Q = 13 × 71: 71 is a prime factor of Q, 71 = 4·17 + 3, and 71 is not 3, 7 or 11. So 71 is a new prime of the form 4k + 3. (13 = 4·3 + 1 is not of that form.)
>
> The same construction, applied to any finite list of primes of the form 4k + 3, always produces a new one, so there are infinitely many such primes.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `q2` | Q for 2, 3, 5, 7, 11, 13 | number | **30031** | 接受：`30031`；应判错：`30030`, `30029` |
| `rem` | Remainder of Q divided by any listed prime | number | **1** | 接受：`1`；应判错：`0` |
| `prodCheck` | 59 × 509 | number | **30031** | 接受：`30031`；应判错：`30030` |
| `guarantee` | What does the argument guarantee? | choice | `newfactor` | **✓ Every prime factor of Q is missing from the list**<br>✗ Q itself is always prime<br>✗ Q is the next prime after the list |
| `proof` | Write the complete proof | reason | （人工审阅） | 审阅要点：Prove that every N > 1 has a prime factor (least divisor greater than 1). / Show that a listed prime dividing Q would divide 1; conclude that every finite list misses a prime.<br>追问：Does the proof need Q to be prime? Use 30031 in your answer. |
| `q3` | Q = 4 × 231 − 1 | number | **923** | 接受：`923`；应判错：`924`, `231` |
| `mod4` | Q mod 4 | number | **3** | 接受：`3`；应判错：`1`, `-1` |
| `f3` | Prime factor of the form 4k + 3 | number | **71** | 接受：`71`；应判错：`13`, `3` |
| `variation` | Prove the variation | reason | （人工审阅） | 审阅要点：A product of numbers of the form 4k + 1 is again of the form 4k + 1; use this (for example with a smallest counterexample) to show that Q ≡ 3 (mod 4) has a prime factor of the form 4k + 3. / Q leaves a nonzero remainder when divided by 3, 7 or 11, so that factor is new.<br>追问：Why does the same trick not show directly that there are infinitely many primes of the form 4k + 1? |

**Reference solution（总结）：** Q = 30031 leaves remainder 1 when divided by each listed prime, so its prime factors (59 and 509) are new. Every N > 1 has a prime factor, so every finite list of primes is incomplete. For 4k + 3: Q = 923 ≡ 3 (mod 4) must have a prime factor of that form outside the list; it is 71.

**Next check：** Use Q = 6 × (a product of primes) − 1 to prove that there are infinitely many primes of the form 6k + 5.


### 项目 5 · nt-p03 · Why digit tests work

- **层级：** High-school foundation · medium · Modular arithmetic
- **经典来源：** "弃九法"验算（中世纪印度与阿拉伯数学已有）；模 9 与模 11 的整除判别；加权模 11 校验码（与真实的书号校验思路相同，这里用的是虚构编码）。
- **思路导引（中文，给老师和设计者）：** 核心想法：把一个数写成"各位数字 × 10 的幂"之和，再用两个事实：10 ≡ 1 (mod 9)，10 ≡ −1 (mod 11)。这样数位和、交错和的检验就从"口诀"变成了可以证明的定理。接着用同样的写法，算出"交换相邻两位"会让数值改变 9 × 10ʲ × (两数字之差)，于是一般地证明：模 9 永远查不出这种错误，模 11 永远能查出。最后的校验码题，用"11 是质数"证明它能查出所有单个数字错误和相邻互换。整个过程都是一般证明，不靠举例。
- **用到的结论（Uses）：** Rules for adding and multiplying congruences (proved in Step 2); Euclid’s lemma: if a prime divides a product, it divides a factor (assumed).
- **诊断点：** 同余的加法和乘法规则；从"口诀"到"定理"；用一般表达式 9·10ʲ(u − v) 证明而不是举例；质数性质在校验码中的作用。
- **图形 / 互动建议：** 数位卡片：可拖动交换相邻两位，实时显示数值的变化量 9·10ʲ(u − v)，以及模 9、模 11 的余数。

**Prompt**

> At an invented school store, a clerk checks long totals with quick digit tests instead of a calculator. You will prove why the tests work and exactly what they can and cannot catch.

**How to think about it（`approach`，可直接放网站）**

> Write a number as digits times powers of 10. Since 10 ≡ 1 (mod 9) and 10 ≡ −1 (mod 11), the digit tests become theorems. The same expression shows that swapping two neighboring digits changes the number by 9·10ʲ(u − v), which is always a multiple of 9 and never a multiple of the prime 11.

#### 1 · Two quick remainders

> For N = 7,384,512, add the digits to find N mod 9. Then use the alternating sum starting from the last digit (2 − 1 + 5 − 4 + …) to find N mod 11.

字段：`mod9`, `mod11`

**Reference proof（`referenceSolution`）**

> Digit sum: 7 + 3 + 8 + 4 + 5 + 1 + 2 = 30, and 30 = 3·9 + 3, so N ≡ 3 (mod 9).
>
> Alternating sum from the right: 2 − 1 + 5 − 4 + 8 − 3 + 7 = 14, and 14 = 11 + 3, so N ≡ 3 (mod 11).
>
> Step 2 proves that these shortcuts give the true remainders.

#### 2 · Prove both tests

> Write N = dₖ10ᵏ + … + d₁10 + d₀. Prove that N ≡ dₖ + … + d₁ + d₀ (mod 9) and N ≡ d₀ − d₁ + d₂ − … (mod 11).

字段：`testsProof`

**Reference proof（`referenceSolution`）**

> Rules used: if a ≡ b and c ≡ d (mod m), then a + c ≡ b + d and ac ≡ bd (mod m). Proof: m divides (a − b) and (c − d); then (a + c) − (b + d) = (a − b) + (c − d), and ac − bd = a(c − d) + d(a − b), are multiples of m.
>
> Since 10 = 9 + 1, we have 10 ≡ 1 (mod 9). Multiplying this congruence by itself j times gives 10ʲ ≡ 1ʲ = 1 (mod 9). Then dⱼ10ʲ ≡ dⱼ (mod 9) for each j, and adding, N ≡ dₖ + … + d₀ (mod 9).
>
> Since 10 = 11 − 1, we have 10 ≡ −1 (mod 11), so 10ʲ ≡ (−1)ʲ (mod 11). Then N ≡ d₀ − d₁ + d₂ − … (mod 11). ∎

#### 3 · What a swap of neighboring digits does

> A total of 52,317 was typed as 52,137, with two neighboring digits swapped. Find the difference. Then prove in general: swapping two different neighboring digits always changes N by a multiple of 9, but never by a multiple of 11. Which test notices the swap?

字段：`diff`, `notices`, `swapProof`

**Reference proof（`referenceSolution`）**

> 52,317 − 52,137 = 180.
>
> General claim. Suppose the digits in places j + 1 and j (that is, the digits multiplying 10ʲ⁺¹ and 10ʲ) are u and v, with u ≠ v. Before the swap they contribute u·10ʲ⁺¹ + v·10ʲ, and after it v·10ʲ⁺¹ + u·10ʲ. The change is
>
> (u − v)·10ʲ⁺¹ − (u − v)·10ʲ = 9·10ʲ·(u − v).
>
> This is always a multiple of 9, so the digit-sum test can never notice such a swap (the digits are the same, so the digit sum does not change).
>
> Modulo 11, 9·10ʲ·(u − v) ≡ 9·(−1)ʲ·(u − v). Since 11 is prime, it divides this product only if it divides 9 or u − v. It does not divide 9, and 0 < |u − v| ≤ 9, so it does not divide u − v. So the change is never a multiple of 11, and the alternating test always notices the swap.
>
> In the example, the swapped digits are 3 and 1 in the hundreds and tens places (j = 1): 9·10·(3 − 1) = 180.

#### 4 · Design a check digit and prove what it catches

> An invented store code has nine digits d₁…d₉ followed by a check value c chosen so that 10d₁ + 9d₂ + … + 2d₉ + 1·c is a multiple of 11 (c = 10 is printed as X). For the digits 4 7 1 2 0 9 3 6 5, find the weighted sum and c. Then prove that the scheme catches every single wrong digit and every swap of two different neighboring symbols.

字段：`wsum`, `check`, `swaps`, `checkProof`

**Reference proof（`referenceSolution`）**

> Weighted sum: 10·4 + 9·7 + 8·1 + 7·2 + 6·0 + 5·9 + 4·3 + 3·6 + 2·5 = 40 + 63 + 8 + 14 + 0 + 45 + 12 + 18 + 10 = 210. Since 210 = 19·11 + 1, we need 1 + c ≡ 0 (mod 11), so c = 10, printed X.
>
> Let S be the weighted sum of a valid code, so S ≡ 0 (mod 11), and let the position with weight w hold the symbol s.
>
> Single wrong symbol: if s becomes s′ ≠ s, S changes by w(s′ − s). Here 1 ≤ w ≤ 10 and 0 < |s′ − s| ≤ 10, so 11 divides neither factor. Since 11 is prime, it does not divide the product, so the new sum is not ≡ 0 and the error is caught.
>
> Neighboring swap: neighboring weights are w + 1 and w. If symbols s and t (s ≠ t) swap, S changes by (w + 1)t + ws − (w + 1)s − wt = t − s, which is between −10 and 10 and not 0, so it is not a multiple of 11. The error is caught. ∎

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `mod9` | N mod 9 | number | **3** | 接受：`3`；应判错：`30`, `0`, `6` |
| `mod11` | N mod 11 | number | **3** | 接受：`3`；应判错：`14`, `30` |
| `testsProof` | Prove both digit tests | reason | （人工审阅） | 审阅要点：Use 10 ≡ 1 (mod 9) and 10 ≡ −1 (mod 11), and raise them to powers. / Combine term by term using the rules for adding and multiplying congruences.<br>追问：Which rule about congruences did you use when raising 10 ≡ 1 to the j-th power? |
| `diff` | Difference 52,317 − 52,137 | number | **180** | 接受：`180`；应判错：`18`, `200` |
| `notices` | Which test notices the swap? | choice | `only11` | **✓ Only the alternating (mod 11) test**<br>✗ Only the digit-sum (mod 9) test<br>✗ Both tests<br>✗ Neither test |
| `swapProof` | Prove the general swap result | reason | （人工审阅） | 审阅要点：Show the change is 9·10ʲ·(u − v). / Explain why it is always a multiple of 9 and, using that 11 is prime, never a multiple of 11.<br>追问：Would a test based on 3 instead of 9 notice the swap? |
| `wsum` | Weighted sum of the nine digits | number | **210** | 接受：`210`；应判错：`37`, `198` |
| `check` | Check value c | number | **10** | 接受：`10`；应判错：`1`, `0`, `2` |
| `swaps` | Does the scheme catch every neighboring swap? | choice | `yes` | **✓ Yes; a neighboring swap changes the sum by the difference of the two symbols, which is never a multiple of 11**<br>✗ No; swaps keep the same symbols, so the sum cannot change<br>✗ Only swaps that involve the digit 0 |
| `checkProof` | Prove what the check digit catches | reason | （人工审阅） | 审阅要点：A single wrong symbol changes the sum by w(s′ − s); neither factor is a multiple of the prime 11. / A neighboring swap changes the sum by t − s, which is nonzero and between −10 and 10.<br>追问：Why would the proof fail if the scheme used 10 instead of 11? |

**Reference solution（总结）：** 10 ≡ 1 (mod 9) and 10 ≡ −1 (mod 11) prove the digit-sum and alternating tests. Swapping neighboring digits u ≠ v changes N by 9·10ʲ(u − v): always a multiple of 9, never a multiple of 11. The check value for 4 7 1 2 0 9 3 6 5 is X (10), and because 11 is prime the scheme catches every single error and every neighboring swap.

**Next check：** Prove that the mod 11 check-digit scheme also catches the swap of any two symbols, not only neighboring ones.


### 项目 6 · nt-p04 · An ancient remainder puzzle

- **层级：** Bridge (high school to undergraduate) · challenging · Congruences and the Chinese Remainder Theorem
- **经典来源：** 《孙子算经》（约 3–5 世纪）中的"物不知数"问题：三三数之剩二，五五数之剩三，七七数之剩二。这是公有领域的古代问题，题干用我们自己的英文转述。
- **思路导引（中文，给老师和设计者）：** 核心想法：用"逐个代入"代替"从 1 开始找"。先把最大模数的条件写成 x = 7k + 2，再代入下一个条件解出 k，这样每一步都是解一个很小的一次同余方程。然后证明解"在模 105 意义下唯一"——这一步要用"两两互素的数都整除 N，则它们的乘积也整除 N"。第 3 步给出孙子的"拼装法"并证明它为什么对。第 4 步讨论模不互素的情况，给出一般判别法：有解当且仅当两个余数模 gcd 同余。
- **用到的结论（Uses）：** Bézout’s identity in general (from the extended Euclidean algorithm, nt-p02; assumed in general); the coprime-divisor lemma (proved in Step 2).
- **诊断点：** 解一次同余方程（乘以逆元）；代入法每一步可逆；"两两互素 ⇒ 乘积整除"的证明；模不互素时的一般判别法。
- **图形 / 互动建议：** 三条数轴分别标出余数 2（模 3）、3（模 5）、2（模 7）的位置，交点为 23、128、233。

**Prompt**

> A puzzle recorded in an ancient Chinese mathematics text asks for a number of objects that leaves remainder 2 when counted by threes, remainder 3 when counted by fives, and remainder 2 when counted by sevens. Solve it by reasoning, not by searching.

**How to think about it（`approach`，可直接放网站）**

> Do not count up from 1. Write the condition with the largest modulus as x = 7k + 2 and substitute it into the next condition; each step is a small linear congruence. Then prove the answer is unique modulo 105, because coprime divisors multiply. Finally, find the exact condition for when two congruences can hold together.

#### 1 · Solve by substitution

> From x ≡ 2 (mod 7), write x = 7k + 2. Substitute into x ≡ 3 (mod 5) and solve for k mod 5. Continue with x ≡ 2 (mod 3). Give k mod 5, the smallest positive solution, and the distance between consecutive solutions.

字段：`kmod5`, `smallest`, `period`

**Reference proof（`referenceSolution`）**

> x = 7k + 2. The condition x ≡ 3 (mod 5) becomes 7k + 2 ≡ 3, that is, 2k ≡ 1 (mod 5) because 7 ≡ 2. Since 2·3 = 6 ≡ 1 (mod 5), multiplying by 3 gives k ≡ 3 (mod 5). Write k = 5j + 3, so x = 35j + 23.
>
> The condition x ≡ 2 (mod 3) becomes 35j + 23 ≡ 2, that is, 2j + 2 ≡ 2 (mod 3) because 35 ≡ 2 and 23 ≡ 2. So 2j ≡ 0 (mod 3). Multiplying by 2 (since 2·2 = 4 ≡ 1) gives j ≡ 0 (mod 3). Write j = 3i, so x = 105i + 23.
>
> Every solution has this form, and every number of this form is a solution, since each substitution step was reversible. The smallest positive solution is 23, and consecutive solutions differ by 105.

#### 2 · Prove that the answer is unique modulo 105

> Prove: if x and y are both solutions, then 105 divides x − y. Use the fact that 3, 5 and 7 have no common factors in pairs.

字段：`uniq`

**Reference proof（`referenceSolution`）**

> Lemma. If m | N, n | N and gcd(m, n) = 1, then mn | N.
>
> Proof. By Bézout’s identity there are integers u, v with um + vn = 1. Write N = m·N₁ = n·N₂. Then N = N·(um + vn) = um·n·N₂ + vn·m·N₁ = mn(uN₂ + vN₁). ∎
>
> If x and y are solutions, then x − y ≡ 0 modulo 3, 5 and 7. By the lemma with m = 3, n = 5, we get 15 | x − y. Since gcd(15, 7) = 1, the lemma again gives 105 | x − y. So all solutions are congruent modulo 105, and with Step 1 they are exactly 23 + 105i.

#### 3 · Sunzi’s construction, and a modern version

> Let u₁, u₂, u₃ be the inverses of 35 mod 3, of 21 mod 5, and of 15 mod 7, each chosen between 1 and the modulus minus 1. Find u₁, compute x = 2·35·u₁ + 3·21·u₂ + 2·15·u₃, reduce it modulo 105, and prove why the construction works. Then an invented seed library sorts between 200 and 300 packets into trays of 3, 5 and 7, with remainders 2, 3 and 2 as in the puzzle. How many packets are there?

字段：`inv35`, `built`, `reduced`, `packets`

**Reference proof（`referenceSolution`）**

> Inverses: 35 ≡ 2 (mod 3) and 2·2 = 4 ≡ 1, so u₁ = 2. 21 ≡ 1 (mod 5), so u₂ = 1. 15 ≡ 1 (mod 7), so u₃ = 1.
>
> x = 2·35·2 + 3·21·1 + 2·15·1 = 140 + 63 + 30 = 233, and 233 = 2·105 + 23, so x ≡ 23 (mod 105).
>
> Why it works: 35 is a multiple of 5 and 7, 21 of 3 and 7, and 15 of 3 and 5. Modulo 3, the last two terms vanish and the first is 2·(35·u₁) ≡ 2·1 = 2. Modulo 5, only the middle term survives: 3·(21·u₂) ≡ 3. Modulo 7, only the last term survives: 2·(15·u₃) ≡ 2.
>
> Seed library: by Step 2, the count is 23 + 105i. The inequality 200 ≤ 23 + 105i ≤ 300 gives 177/105 ≤ i ≤ 277/105, so i = 2 and the count is 233.

#### 4 · When the moduli share a factor

> Decide whether x ≡ 1 (mod 4) and x ≡ 2 (mod 6) has a solution. Then solve x ≡ 1 (mod 4), x ≡ 3 (mod 6) by substitution: give the smallest positive solution and the repeat length. State and prove a rule for when x ≡ a (mod m), x ≡ b (mod n) has a solution.

字段：`sys1`, `sys2small`, `sys2period`, `shared`

**Reference proof（`referenceSolution`）**

> First system: x ≡ 1 (mod 4) makes x odd, and x ≡ 2 (mod 6) makes x even, so there is no solution.
>
> Second system: x = 4k + 1, and 4k + 1 ≡ 3 (mod 6) means 6 | 4k − 2, that is, 3 | 2k − 1, so 2k ≡ 1 (mod 3) and k ≡ 2 (mod 3). Write k = 3j + 2: x = 12j + 9. The smallest positive solution is 9, and solutions repeat every 12 = lcm(4, 6).
>
> Rule. Let g = gcd(m, n). The system has a solution if and only if g | a − b, and then the solutions form one class modulo lcm(m, n).
>
> Proof. If x is a solution, g divides m and n, so x ≡ a and x ≡ b (mod g), and g | a − b. Conversely, suppose a − b = gt. By Bézout, g = um + vn. Put x = a − umt. Then x ≡ a (mod m), and x = a − (g − vn)t = b + vnt ≡ b (mod n). Write m = gm′ and n = gn′. If d > 0 divides m′ and n′, then gd divides m and n, so gd ≤ g and d = 1. Hence gcd(m′, n′) = 1, and by Bézout 1 = sm′ + wn′ for some integers s, w.
>
> Let L = gm′n′. If x and y are two solutions, then m | x − y and n | x − y. Write x − y = mk. Since n | mk, we get n′ | m′k, and k = s(m′k) + w(n′k) is a multiple of n′. So L = gm′·n′ divides mk = x − y. Conversely, m | L and n | L, so x + iL is a solution for every integer i. So the solutions form exactly one class modulo L.
>
> Finally, L = lcm(m, n): L = mn′ = nm′ is a common multiple, and the same argument (with x − y replaced by any common multiple) shows that L divides every common multiple of m and n. ∎
>
> For the first system, g = 2 does not divide 1 − 2; for the second, g = 2 divides 1 − 3.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `kmod5` | k mod 5 | number | **3** | 接受：`3`；应判错：`1`, `2`, `8` |
| `smallest` | Smallest positive solution | number | **23** | 接受：`23`；应判错：`2`, `128`, `105` |
| `period` | Distance between solutions | number | **105** | 接受：`105`；应判错：`15`, `35` |
| `uniq` | Prove uniqueness modulo 105 | reason | （人工审阅） | 审阅要点：Prove or cite: if m | N, n | N and gcd(m, n) = 1, then mn | N. / Apply it twice to x − y.<br>追问：Where did you use that 3, 5 and 7 are pairwise coprime? |
| `inv35` | Inverse of 35 modulo 3 | number | **2** | 接受：`2`；应判错：`1`, `35` |
| `built` | Value from the construction | number | **233** | 接受：`233`；应判错：`23`, `105` |
| `reduced` | Reduced modulo 105 | number | **23** | 接受：`23`；应判错：`233` |
| `packets` | Number of packets | number | **233** | 接受：`233`；应判错：`23`, `128`, `338` |
| `sys1` | Does x ≡ 1 (mod 4), x ≡ 2 (mod 6) have a solution? | choice | `no` | **✓ No; the first makes x odd and the second makes x even**<br>✗ Yes; every pair of congruences has a solution<br>✗ Yes; infinitely many, every 24 numbers |
| `sys2small` | Smallest positive solution of the second system | number | **9** | 接受：`9`；应判错：`3`, `21`, `13` |
| `sys2period` | Repeat length of the second system | number | **12** | 接受：`12`；应判错：`24`, `2` |
| `shared` | State and prove the general rule | reason | （人工审阅） | 审阅要点：A solution exists exactly when gcd(m, n) divides a − b. / Prove both directions (Bézout for existence), and prove that the solutions form one class modulo lcm(m, n).<br>追问：Use your rule to decide quickly whether x ≡ 5 (mod 12) and x ≡ 8 (mod 18) has a solution. |

**Reference solution（总结）：** Substitution gives x = 7k + 2, k ≡ 3 (mod 5), j ≡ 0 (mod 3), so x = 105i + 23; solutions are unique modulo 105 because 3, 5, 7 are pairwise coprime. Sunzi’s construction gives 233 ≡ 23. In general, x ≡ a (mod m), x ≡ b (mod n) is solvable exactly when gcd(m, n) | a − b, with solutions repeating every lcm(m, n).

**Next check：** Solve a three-congruence system of your own whose smallest positive solution is above 1000, using only substitution.


### 项目 7 · nt-p07 · Right triangles with whole-number sides

- **层级：** Bridge (high school to undergraduate) · challenging · Pythagorean triples
- **经典来源：** 勾股数的生成公式（欧几里得《几何原本》第十卷）；单位圆上的有理点与勾股数的对应。
- **思路导引（中文，给老师和设计者）：** 核心想法：先用代数恒等式证明公式一定给出勾股数；再证明在"m、n 互素、一奇一偶"时得到的是本原勾股数；最难也最漂亮的是第 4 步——反过来证明"每一个本原勾股数都来自这个公式"，关键是把 b² = c² − a² 分解成 (c − a)(c + a)，并用"两个互素的正整数相乘是平方数，则各自都是平方数"。这样就不需要列出所有勾股数，而是用定理一次性刻画全部。第 5 步从几何角度再看一次：过 (−1, 0) 的有理斜率直线与单位圆的另一个交点，用韦达定理求出，不用解二次方程。
- **用到的结论（Uses）：** Unique factorization of integers (assumed); squares modulo 4; Vieta’s formula for the product of roots.
- **诊断点：** 代数恒等式的一般证明；本原性的条件与证明；模 4 的奇偶论证；"互素且乘积为平方 ⇒ 各自为平方"（唯一分解定理）；韦达定理求第二个交点。
- **图形 / 互动建议：** 单位圆，过 (−1, 0) 的直线可用滑块改变斜率 t = n/m，显示交点坐标与对应勾股数。

**Prompt**

> A Pythagorean triple (a, b, c) consists of positive integers with a² + b² = c². It is primitive if gcd(a, b, c) = 1. Find a formula for triples and prove that it produces every primitive triple.

**How to think about it（`approach`，可直接放网站）**

> First prove the formula always gives a triple. Then go backward: factor b² = (c − a)(c + a), show that (c + a)/2 and (c − a)/2 are coprime, and use unique factorization to show they are squares. This describes every primitive triple at once, so nothing needs to be counted.

#### 1 · The formula always works

> For integers m > n > 0, set a = m² − n², b = 2mn, c = m² + n². Prove a² + b² = c² for all such m and n. Compute the triple for m = 5, n = 2.

字段：`a`, `b`, `c`, `identity`

**Reference proof（`referenceSolution`）**

> (m² − n²)² + (2mn)² = m⁴ − 2m²n² + n⁴ + 4m²n² = m⁴ + 2m²n² + n⁴ = (m² + n²)². ∎
>
> For m = 5, n = 2: a = 25 − 4 = 21, b = 20, c = 29, and 441 + 400 = 841 = 29².

#### 2 · When is the triple primitive?

> Show what goes wrong when m and n are both odd (for example m = 5, n = 3) and when they share a factor; give the gcd of the triple for m = 5, n = 3. Then prove: if gcd(m, n) = 1 and m, n have opposite parity, the triple is primitive.

字段：`bothOdd`, `gcd53`, `primitive`

**Reference proof（`referenceSolution`）**

> m = 5, n = 3 gives (16, 30, 34), and gcd = 2. In general, if m and n are both odd, then m² − n², 2mn and m² + n² are all even. If d = gcd(m, n) > 1, then d² divides all three.
>
> Claim: if gcd(m, n) = 1 and m, n have opposite parity, then gcd(a, b, c) = 1.
>
> Proof. c = m² + n² is odd, since exactly one of m², n² is odd. Suppose a prime p divides a, b and c. Then p ≠ 2, because c is odd. Also p | c + a = 2m² and p | c − a = 2n², and since p is odd, p | m² and p | n², so p | m and p | n. This contradicts gcd(m, n) = 1. ∎

#### 3 · A parity fact

> Prove that in every primitive triple, c is odd and exactly one of a, b is even.

字段：`parity`

**Reference proof（`referenceSolution`）**

> Every square is 0 or 1 modulo 4: (2k)² = 4k² and (2k + 1)² = 4(k² + k) + 1.
>
> If a and b were both even, then c² = a² + b² would be even, so c would be even and 2 would divide a, b and c; impossible for a primitive triple.
>
> If a and b were both odd, then a² + b² ≡ 1 + 1 = 2 (mod 4), but c² is 0 or 1 (mod 4); impossible.
>
> So exactly one of a, b is even. Then a² + b² ≡ 0 + 1 = 1 (mod 4), so c² is odd and c is odd. ∎

#### 4 · Every primitive triple comes from the formula

> Let (a, b, c) be primitive with b even. Set u = (c + a)/2 and v = (c − a)/2. Prove that u and v are coprime positive integers with uv = (b/2)², and conclude that u = m² and v = n². Then find m and n for the triple (21, 20, 29) and for (7, 24, 25).

字段：`m1`, `n1`, `m2`, `n2`, `allTriples`

**Reference proof（`referenceSolution`）**

> By Step 3, a and c are odd, so c + a and c − a are even and u, v are integers. Since c > a > 0, both are positive.
>
> uv = (c² − a²)/4 = b²/4 = (b/2)².
>
> gcd(u, v) = 1: a common divisor d of u and v divides u + v = c and u − v = a. If a prime p divided both a and c, it would divide c² − a² = b², hence b, contradicting primitivity. So gcd(a, c) = 1 and d = 1.
>
> Lemma. If u and v are coprime positive integers and uv is a perfect square, then u and v are perfect squares.
>
> Proof. By unique factorization, write uv = w². For each prime p, its exponent in w² is even. Since gcd(u, v) = 1, p divides at most one of u and v, so its whole (even) exponent sits in that one. So every prime has an even exponent in u and in v. ∎
>
> So u = m² and v = n² with m > n > 0, and then c = u + v = m² + n², a = u − v = m² − n², and b² = 4m²n² gives b = 2mn. gcd(m, n) = 1 because gcd(u, v) = 1, and m, n have opposite parity because c is odd.
>
> (21, 20, 29): u = (29 + 21)/2 = 25 = 5², v = (29 − 21)/2 = 4 = 2², so m = 5, n = 2.
>
> (7, 24, 25): u = (25 + 7)/2 = 16 = 4², v = (25 − 7)/2 = 9 = 3², so m = 4, n = 3.

#### 5 · Triples on a circle

> Dividing a² + b² = c² by c² gives a point (a/c, b/c) on the unit circle x² + y² = 1. The line through (−1, 0) with slope t = 2/3 meets the circle at a second point. Find it without solving a quadratic from scratch: substitute y = t(x + 1) and use the product of the roots. Give the coordinates as exact fractions (a decimal rounded to two places is also accepted), and the primitive triple the point gives.

字段：`px`, `py`, `triple`

**Reference proof（`referenceSolution`）**

> Substituting y = t(x + 1) into x² + y² = 1 gives (1 + t²)x² + 2t²x + (t² − 1) = 0. One root is x = −1. The product of the roots is (t² − 1)/(1 + t²), so the other root is x = (1 − t²)/(1 + t²), and then y = t(x + 1) = 2t/(1 + t²).
>
> With t = 2/3: x = (1 − 4/9)/(1 + 4/9) = 5/13 and y = (4/3)/(13/9) = 12/13. Multiplying by 13 gives the primitive triple (5, 12, 13), which is the formula with m = 3, n = 2 (t = n/m).

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `a` | a | number | **21** | 接受：`21`；应判错：`29`, `20` |
| `b` | b | number | **20** | 接受：`20`；应判错：`10`, `21` |
| `c` | c | number | **29** | 接受：`29`；应判错：`21`, `25` |
| `identity` | Prove the identity | reason | （人工审阅） | 审阅要点：Expand (m² − n²)² + (2mn)² and simplify to (m² + n²)².<br>追问：Does the identity need m > n? What changes if m < n? |
| `bothOdd` | What happens when m and n are both odd? | choice | `even` | **✓ All three sides are even, so the triple is not primitive**<br>✗ a² + b² = c² fails<br>✗ Nothing; the triple is always primitive |
| `gcd53` | gcd of the triple from m = 5, n = 3 | number | **2** | 接受：`2`；应判错：`1`, `4` |
| `primitive` | Prove the primitivity condition | reason | （人工审阅） | 审阅要点：c = m² + n² is odd, so a common prime factor p is odd. / p divides c + a = 2m² and c − a = 2n², so p divides m and n, contradicting gcd(m, n) = 1.<br>追问：Why do you need both conditions, coprime and opposite parity? |
| `parity` | Prove the parity fact | reason | （人工审阅） | 审阅要点：Squares are 0 or 1 modulo 4. / Rule out both legs even (not primitive) and both legs odd (sum ≡ 2 mod 4).<br>追问：Where does primitivity enter your proof? |
| `m1` | m for (21, 20, 29) | number | **5** | 接受：`5`；应判错：`2`, `21` |
| `n1` | n for (21, 20, 29) | number | **2** | 接受：`2`；应判错：`5`, `4` |
| `m2` | m for (7, 24, 25) | number | **4** | 接受：`4`；应判错：`3`, `16` |
| `n2` | n for (7, 24, 25) | number | **3** | 接受：`3`；应判错：`4`, `9` |
| `allTriples` | Prove that every primitive triple comes from the formula | reason | （人工审阅） | 审阅要点：Show u, v are coprime positive integers with uv = (b/2)². / Use unique factorization to show u and v are squares, then recover a, b, c.<br>追问：Why must b be the even leg in this argument? |
| `px` | x-coordinate of the second point | number | **5/13** | 接受：`5/13`, `0.38`；应判错：`2/3`, `12/13` |
| `py` | y-coordinate of the second point | number | **12/13** | 接受：`12/13`, `0.92`；应判错：`5/13`, `2/3` |
| `triple` | Which primitive triple does the point give? | choice | `5-12-13` | **✓ 5, 12, 13**<br>✗ 3, 4, 5<br>✗ 2, 3, √13 |

**Reference solution（总结）：** The identity (m² − n²)² + (2mn)² = (m² + n²)² shows the formula works; it gives primitive triples exactly when gcd(m, n) = 1 with opposite parity. Conversely, for a primitive triple with b even, (c + a)/2 and (c − a)/2 are coprime with product (b/2)², hence squares m² and n². On the unit circle, slope t = 2/3 gives (5/13, 12/13), the triple (5, 12, 13).

**Next check：** Check that 65 = 8² + 1² = 7² + 4². Use Step 4 to find the primitive triples with hypotenuse 65 that these give, and explain why the formula with m = 8, n = 1 and with m = 7, n = 4 gives primitive triples.


### 项目 8 · nt-p05 · Last digits and a theorem that can be fooled

- **层级：** Intro undergraduate · challenging · Powers modulo n and Fermat’s little theorem
- **经典来源：** 费马小定理（费马 1640 年的信中提出）；反复平方法；341 = 11 × 31 是以 2 为底的最小费马伪素数（19 世纪初已有人指出）。
- **思路导引（中文，给老师和设计者）：** 核心想法：把大指数"变小"。第 1 步用 7² ≡ −1 (mod 10) 一下子得到 7⁴ ≡ 1，不需要把 7 的各次方都列出来。第 2 步证明费马小定理：a, 2a, …, (p − 1)a 除以 p 的余数恰好是 1, 2, …, p − 1 换了顺序——这是全题的理论核心。第 3 步用"反复平方"把 3⁴⁵ 拆成 3³²·3⁸·3⁴·3，只需 5 次平方。第 4、5 步讨论"反过来对不对"：341 = 11 × 31 是合数，却满足 2³⁴⁰ ≡ 1 (mod 341)；换成底数 3，分别模 11、模 31 计算，再用中国剩余定理合并，得到 56 ≠ 1。最后用完全不依赖因数的反复平方（模 341）再算一次，说明"费马检验失败"本身就能证明一个数是合数，不需要先找到因数。
- **用到的结论（Uses）：** Euclid’s lemma (assumed); the alternating test for 11 (nt-p03); the coprime-divisor lemma (nt-p04).
- **诊断点：** 指数化简（7² ≡ −1）；费马小定理的置换证明；反复平方法；逆命题不成立（伪素数）；逆否命题的正确用法（底数 3 是"合数的证据"）。
- **图形 / 互动建议：** "平方链"动画：每平方一次，显示 3²、3⁴、3⁸、3¹⁶ 模 17 的余数，同时高亮 45 的二进制位。

**Prompt**

> Huge powers can be reduced by reasoning instead of by multiplying out. You will prove Fermat’s little theorem, use it to compute quickly, and then see exactly what it can and cannot prove about a number.

**How to think about it（`approach`，可直接放网站）**

> Make huge exponents small. Find a power that is ≡ 1 or ≡ −1, prove Fermat’s little theorem by showing that a, 2a, …, (p − 1)a rearrange 1, …, p − 1 modulo p, and use repeated squaring. Then separate a theorem from its converse: passing the base-2 test proves nothing, but failing the base-3 test proves that 341 is composite.

#### 1 · The last digit of a huge power

> Find the last digit of 7²⁰²⁶. Start from 7² = 49 ≡ −1 (mod 10). Find 7⁴ mod 10 and 2026 mod 4, then the last digit.

字段：`four`, `expRem`, `last`

**Reference proof（`referenceSolution`）**

> 7⁴ = (7²)² ≡ (−1)² = 1 (mod 10).
>
> 2026 = 4·506 + 2, so 2026 mod 4 = 2.
>
> 7²⁰²⁶ = (7⁴)⁵⁰⁶·7² ≡ 1⁵⁰⁶·49 ≡ 9 (mod 10). The last digit is 9.

#### 2 · Prove Fermat’s little theorem

> Let p be prime and a an integer that p does not divide. Prove that a, 2a, …, (p − 1)a leave the remainders 1, 2, …, p − 1, in some order, when divided by p. Conclude that a^(p−1) ≡ 1 (mod p). Then find 2¹⁰⁰ mod 13: give the exponent after reducing it with the theorem, and the value.

字段：`fltProof`, `reduced`, `pow`

**Reference proof（`referenceSolution`）**

> No remainder is 0: for 1 ≤ k ≤ p − 1, p divides neither k nor a, so since p is prime, p does not divide ka.
>
> No two remainders are equal: if ia ≡ ja (mod p) with 1 ≤ j < i ≤ p − 1, then p | (i − j)a. Since p ∤ a and p is prime, p | i − j. But 0 < i − j < p, a contradiction.
>
> So the p − 1 numbers ka have p − 1 different remainders, all in {1, …, p − 1}. That set has exactly p − 1 elements, so the remainders are 1, …, p − 1 in some order.
>
> Multiplying all the congruences: a·2a·⋯·(p − 1)a ≡ 1·2·⋯·(p − 1), that is, a^(p−1)·(p − 1)! ≡ (p − 1)! (mod p). So p | (a^(p−1) − 1)·(p − 1)!. The prime p divides none of the factors 1, …, p − 1, so p ∤ (p − 1)!, and therefore p | a^(p−1) − 1. ∎
>
> Application: 13 is prime and 13 ∤ 2, so 2¹² ≡ 1 (mod 13). 100 = 12·8 + 4, so 2¹⁰⁰ = (2¹²)⁸·2⁴ ≡ 16 ≡ 3 (mod 13).

#### 3 · Repeated squaring

> Compute 3⁴⁵ mod 17. Find 3², 3⁴, 3⁸, 3¹⁶ and 3³² mod 17, each by squaring the one before, write 45 as a sum of powers of 2, and multiply. Give 3¹⁶ mod 17, the number of squarings, and 3⁴⁵ mod 17. Which theorem predicts 3¹⁶ mod 17 without any squaring?

字段：`p16`, `squarings`, `result`

**Reference proof（`referenceSolution`）**

> 3² = 9.
>
> 3⁴ = 81 = 4·17 + 13 ≡ 13 ≡ −4.
>
> 3⁸ ≡ (−4)² = 16 ≡ −1.
>
> 3¹⁶ ≡ (−1)² = 1, as Fermat’s little theorem predicts (17 is prime, so 3¹⁶ ≡ 1).
>
> 3³² ≡ 1² = 1.
>
> That is 5 squarings. In binary, 45 = 101101₂ = 32 + 8 + 4 + 1, so
>
> 3⁴⁵ = 3³²·3⁸·3⁴·3 ≡ 1·(−1)·(−4)·3 = 12 (mod 17).

#### 4 · A composite number that passes

> The theorem says: if n is prime and n ∤ a, then a^(n−1) ≡ 1 (mod n). Take n = 341. Use the alternating-sum test from the digit-test project to show 11 | 341, and give the other factor (both factors are prime). Then use 2¹⁰ = 1024 = 3·341 + 1 to find 2³⁴⁰ mod 341. What does this result prove?

字段：`other`, `base2`, `proves`

**Reference proof（`referenceSolution`）**

> Alternating sum from the right: 1 − 4 + 3 = 0, which is a multiple of 11, so 11 | 341, and 341 = 11·31.
>
> 2¹⁰ = 1024 = 3·341 + 1, so 2¹⁰ ≡ 1 (mod 341). Then 2³⁴⁰ = (2¹⁰)³⁴ ≡ 1 (mod 341).
>
> So 341 passes the test with base 2, although it is composite. Fermat’s theorem says “prime ⇒ passes”; it does not say “passes ⇒ prime”. Passing proves nothing about primality.

#### 5 · Base 3 exposes it

> Compute 3³⁴⁰ mod 341 without a calculator: find it modulo the primes 11 and 31 using Fermat’s theorem for each, then combine by substitution. Explain what the result proves, and why the base-2 result proved nothing. Could someone who did not know any factor of 341 reach the same conclusion?

字段：`mod11`, `mod31`, `base3`, `converse`

**Reference proof（`referenceSolution`）**

> Modulo 11: 3¹⁰ ≡ 1 by Fermat’s theorem, and 340 = 34·10, so 3³⁴⁰ ≡ 1 (mod 11).
>
> Modulo 31: 3³⁰ ≡ 1, and 340 = 11·30 + 10, so 3³⁴⁰ ≡ 3¹⁰. Now 3⁵ = 243 = 7·31 + 26 ≡ −5, so 3¹⁰ ≡ 25 (mod 31).
>
> Combine: x = 31k + 25 and x ≡ 1 (mod 11). Since 31 ≡ 9 and 25 ≡ 3 (mod 11), 9k + 3 ≡ 1, so 9k ≡ −2 ≡ 9 (mod 11). Since gcd(9, 11) = 1, k ≡ 1 (mod 11). So x ≡ 56 (mod 341), and by the uniqueness lemma from the remainder project this is the only class.
>
> So 3³⁴⁰ ≡ 56 ≢ 1 (mod 341). If 341 were prime, Fermat’s theorem would force 3³⁴⁰ ≡ 1 (since 341 ∤ 3). By the contrapositive, 341 is composite.
>
> Here the factors 11 and 31 only shortened the arithmetic. The same value comes from repeated squaring modulo 341, with no factor at all: 3⁸ = 6561 = 19·341 + 82 ≡ 82, 3¹⁶ ≡ 82² = 6724 = 19·341 + 245 ≡ 245, and 3³² ≡ 245² = 60025 = 176·341 + 9 ≡ 9 = 3². So 3³⁴⁰ = (3³²)¹⁰·3²⁰ ≡ (3²)¹⁰·3²⁰ = 3⁴⁰ = 3³²·3⁸ ≡ 9·82 = 738 = 2·341 + 56 ≡ 56. This computation uses no factor, so a failed Fermat test, with a base a that n does not divide, proves on its own that n is composite.
>
> Base 2 passed because 2¹⁰ ≡ 1 modulo both 11 and 31 (1023 = 3·11·31), and 10 | 340. Passing one base is consistent with being composite, so it proves nothing.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `four` | 7⁴ mod 10 | number | **1** | 接受：`1`；应判错：`7`, `9`, `2401` |
| `expRem` | 2026 mod 4 | number | **2** | 接受：`2`；应判错：`0`, `506` |
| `last` | Last digit of 7²⁰²⁶ | number | **9** | 接受：`9`；应判错：`1`, `3`, `7` |
| `fltProof` | Prove Fermat’s little theorem | reason | （人工审阅） | 审阅要点：Show the remainders of a, 2a, …, (p − 1)a are nonzero and pairwise different, so they are 1, …, p − 1 in some order. / Multiply the congruences and cancel (p − 1)!, explaining why p ∤ (p − 1)!.<br>追问：Where exactly does your proof use that p is prime? |
| `reduced` | Reduced exponent for 2¹⁰⁰ mod 13 | number | **4** | 接受：`4`；应判错：`100`, `8`, `12` |
| `pow` | 2¹⁰⁰ mod 13 | number | **3** | 接受：`3`；应判错：`16`, `1`, `4` |
| `p16` | 3¹⁶ mod 17 | number | **1** | 接受：`1`；应判错：`16`, `13` |
| `squarings` | Number of squarings | number | **5** | 接受：`5`；应判错：`45`, `6`, `4` |
| `result` | 3⁴⁵ mod 17 | number | **12** | 接受：`12`；应判错：`5`, `3`, `16` |
| `other` | 341 = 11 × ? | number | **31** | 接受：`31`；应判错：`11`, `341` |
| `base2` | 2³⁴⁰ mod 341 | number | **1** | 接受：`1`；应判错：`2`, `340` |
| `proves` | What does 2³⁴⁰ ≡ 1 (mod 341) prove about 341? | choice | `nothing` | **✓ Nothing about primality; the converse of Fermat’s theorem is false**<br>✗ That 341 is prime<br>✗ That 341 is composite |
| `mod11` | 3³⁴⁰ mod 11 | number | **1** | 接受：`1`；应判错：`3`, `10` |
| `mod31` | 3³⁴⁰ mod 31 | number | **25** | 接受：`25`；应判错：`1`, `10`, `26` |
| `base3` | 3³⁴⁰ mod 341 | number | **56** | 接受：`56`；应判错：`1`, `25`, `26` |
| `converse` | Explain what each base proves | reason | （人工审阅） | 审阅要点：Contrapositive: since 3³⁴⁰ ≢ 1 (mod 341) and 341 ∤ 3, 341 cannot be prime; repeated squaring modulo 341 gives the same result without any factor. / The converse is false: 2³⁴⁰ ≡ 1 (mod 341) although 341 = 11·31, so passing one base proves nothing.<br>追问：Why does 2¹⁰ ≡ 1 modulo both 11 and 31 make 341 pass the base-2 test? |

**Reference solution（总结）：** 7² ≡ −1 gives 7⁴ ≡ 1 (mod 10), so 7²⁰²⁶ ends in 9. The permutation argument proves a^(p−1) ≡ 1 (mod p); then 2¹⁰⁰ ≡ 2⁴ ≡ 3 (mod 13), and repeated squaring gives 3⁴⁵ ≡ 12 (mod 17) with 5 squarings. 341 = 11·31 passes base 2 since 2¹⁰ ≡ 1 (mod 341), but 3³⁴⁰ ≡ 56 (mod 341), which proves 341 composite.

**Next check：** Let n = 561 = 3·11·17. Prove, using Fermat’s theorem for each prime factor and the uniqueness lemma, that a⁵⁶⁰ ≡ 1 (mod 561) for every a with gcd(a, 561) = 1.


### 项目 9 · nt-p06 · A toy public-key lock

- **层级：** Intro undergraduate · challenging · Applications: public-key cryptography
- **经典来源：** RSA 公钥密码（1977 年发表，相关美国专利已于 2000 年到期）；其正确性只用到费马小定理与中国剩余定理。
- **思路导引（中文，给老师和设计者）：** 核心想法：RSA 只用到前面学过的三件事——扩展欧几里得算法（求 d）、费马小定理（缩小指数）、中国剩余定理（分开模 11 和模 13 计算再合并）。φ(143) 用容斥原理计数（数 11 的倍数和 13 的倍数），不需要列出 1 到 143。第 4 步证明"对所有消息都能正确解锁"，包括与 n 不互素的消息，这是很多讲义略过的地方。最后讨论安全性：知道 p、q 就能算出 d，所以安全性取决于"分解大数很难"；追问里还有"知道 φ(n) 就能用一元二次方程求出 p、q"。
- **用到的结论（Uses）：** Fermat’s little theorem (nt-p05); the coprime-divisor lemma (nt-p04); extended Euclidean algorithm (nt-p02); inclusion–exclusion; unique factorization (assumed; used for “the only primes dividing 143 are 11 and 13”).
- **诊断点：** 扩展欧几里得求逆元；容斥原理求 φ(n)；反复平方；中国剩余定理分开计算；正确性证明要分 p | m 和 p ∤ m 两种情况；安全性来自分解困难。
- **图形 / 互动建议：** "上锁 / 开锁"流程图：m → mᵉ mod n = c → cᵈ mod n = m，开锁部分分成模 11 和模 13 两条支路再合并。

**Prompt**

> An invented math club builds a toy lock: anyone can lock a message with public numbers, but only the holder of a secret number can unlock it. Build the keys, lock and unlock a message, and prove that unlocking always works.

**How to think about it（`approach`，可直接放网站）**

> The lock uses only earlier tools. The Euclidean algorithm finds d, Fermat’s theorem shrinks exponents, and the Chinese Remainder Theorem lets you work modulo 11 and 13 separately. The proof that unlocking always works treats the case p | m on its own, because Fermat’s theorem does not apply there.

#### 1 · Build the keys

> The club uses the primes p = 11 and q = 13. Find n = pq. Find φ(n), the number of integers from 1 to n that share no factor greater than 1 with n, by counting multiples of 11 and of 13 (do not list them). The public exponent is e = 7; decide whether it is allowed (it must share no factor greater than 1 with φ(n)). Then use 120 = 17·7 + 1 to find the secret exponent d with 7d ≡ 1 (mod 120) and 0 < d < 120.

字段：`n`, `phi`, `eok`, `d`

**Reference proof（`referenceSolution`）**

> n = 11·13 = 143.
>
> The only primes dividing 143 are 11 and 13, so an integer from 1 to 143 shares a factor with 143 exactly when it is a multiple of 11 or of 13. There are 143/11 = 13 multiples of 11 and 143/13 = 11 multiples of 13. A number divisible by both is divisible by 143 (the lemma: coprime divisors multiply), and only 143 itself is. By inclusion–exclusion, 13 + 11 − 1 = 23 numbers share a factor, so φ(143) = 143 − 23 = 120 = (11 − 1)(13 − 1).
>
> The same count works for any distinct primes p and q: from 1 to pq there are q multiples of p and p multiples of q, and only pq is a multiple of both, so φ(pq) = pq − q − p + 1 = (p − 1)(q − 1).
>
> 120 = 17·7 + 1, so 7 ∤ 120, and since 7 is prime, gcd(7, 120) = 1: e = 7 is allowed.
>
> From 1 = 120 − 17·7 we get 7·(−17) ≡ 1 (mod 120), so d ≡ −17 ≡ 103. Check: 7·103 = 721 = 6·120 + 1.

#### 2 · Lock a message

> The message is m = 9. Compute c = 9⁷ mod 143 by repeated squaring: find 9² and 9⁴ mod 143 first.

字段：`c`

**Reference proof（`referenceSolution`）**

> 9² = 81.
>
> 9⁴ = 81² = 6561 = 45·143 + 126 ≡ 126 ≡ −17 (mod 143).
>
> 9⁷ = 9⁴·9²·9 ≡ (−17)·729. Since 729 = 5·143 + 14, this is (−17)·14 = −238 = −2·143 + 48.
>
> So c = 48.

#### 3 · Unlock with the Chinese Remainder Theorem

> Computing 48¹⁰³ mod 143 directly is long. Find it modulo 11 and modulo 13 instead, using Fermat’s theorem to shrink the exponent, then combine.

字段：`dec11`, `dec13`, `back`

**Reference proof（`referenceSolution`）**

> Modulo 11: 48 = 4·11 + 4 ≡ 4. By Fermat’s theorem, 4¹⁰ ≡ 1, and 103 = 10·10 + 3, so 48¹⁰³ ≡ 4³ = 64 = 5·11 + 9 ≡ 9.
>
> Modulo 13: 48 = 3·13 + 9 ≡ 9. By Fermat’s theorem, 9¹² ≡ 1, and 103 = 8·12 + 7, so 48¹⁰³ ≡ 9⁷. Now 9² = 81 = 6·13 + 3 ≡ 3, so 9⁶ = (9²)³ ≡ 27 ≡ 1, and 9⁷ ≡ 9.
>
> Combine: x − 9 is divisible by 11 and by 13, which are coprime, so 143 | x − 9. So x ≡ 9 (mod 143), and the unlocked message is 9.

#### 4 · Prove that the lock always opens

> Let n = pq with p ≠ q primes, and let e, d be positive integers with ed ≡ 1 (mod (p − 1)(q − 1)). Prove that for every integer m with 0 ≤ m < n, (mᵉ)ᵈ ≡ m (mod n). Treat the cases p | m and p ∤ m separately, then combine the two primes.

字段：`correct`

**Reference proof（`referenceSolution`）**

> Since ed ≡ 1 (mod (p − 1)(q − 1)) and ed > 0, we can write ed = 1 + k(p − 1)(q − 1) with an integer k ≥ 0.
>
> Modulo p. If p | m, both m^(ed) and m are ≡ 0. If p ∤ m, Fermat’s theorem gives m^(p−1) ≡ 1, so m^(ed) = m·(m^(p−1))^(k(q−1)) ≡ m·1 = m. In both cases p | m^(ed) − m.
>
> Modulo q. The same argument gives q | m^(ed) − m.
>
> Since p ≠ q are primes, gcd(p, q) = 1, so pq | m^(ed) − m by the coprime-divisor lemma, that is, m^(ed) ≡ m (mod n). Since 0 ≤ m < n, m is exactly the remainder of m^(ed) on division by n. Reducing c = mᵉ mod n before raising to the power d does not change the result modulo n. ∎

#### 5 · What must stay secret?

> Everyone may know n = 143 and e = 7. Which number must stay secret? Explain why anyone who learns p and q can compute d, and why real locks use primes with hundreds of digits.

字段：`secret`, `factoring`

**Reference proof（`referenceSolution`）**

> The secret is d. The numbers p, q and φ(n) must stay secret too, because each leads to d: from p and q one gets φ(n) = (p − 1)(q − 1), and the extended Euclidean algorithm then gives d as the inverse of e modulo φ(n), exactly as in Step 1.
>
> So the lock is only as safe as factoring n is hard. For n = 143 it is easy. For n with hundreds of digits, no known method on ordinary computers factors it in a practical time.
>
> Even φ(n) alone is enough: p + q = n − φ(n) + 1 and pq = n, so p and q are the roots of t² − (n − φ(n) + 1)t + n = 0. For n = 143, φ = 120: t² − 24t + 143 = 0, so t = 11 or 13.

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `n` | n = pq | number | **143** | 接受：`143`；应判错：`24`, `120` |
| `phi` | φ(n) | number | **120** | 接受：`120`；应判错：`143`, `142`, `119`, `121` |
| `eok` | Is e = 7 allowed? | choice | `yes` | **✓ Yes, because gcd(7, 120) = 1, so 7 has an inverse modulo 120**<br>✗ No, because 7 does not divide 120<br>✗ No, because e must divide n = 143 |
| `d` | Secret exponent d | number | **103** | 接受：`103`；应判错：`17`, `-17`, `7` |
| `c` | Locked message c | number | **48** | 接受：`48`；应判错：`63`, `9` |
| `dec11` | 48¹⁰³ mod 11 | number | **9** | 接受：`9`；应判错：`4`, `3` |
| `dec13` | 48¹⁰³ mod 13 | number | **9** | 接受：`9`；应判错：`3`, `1` |
| `back` | Unlocked message | number | **9** | 接受：`9`；应判错：`48`, `18` |
| `correct` | Prove that unlocking always works | reason | （人工审阅） | 审阅要点：Write ed = 1 + k(p − 1)(q − 1) and use Fermat’s theorem when p ∤ m. / Handle the case p | m separately, do the same for q, and combine with gcd(p, q) = 1.<br>追问：Why is the case p | m needed, and what goes wrong if you only use Euler’s theorem with gcd(m, n) = 1? |
| `secret` | Which number must stay secret? | choice | `d` | **✓ d (and also p, q and φ(n), since each of them leads to d)**<br>✗ e, because it is used to lock<br>✗ n, because it is the product of the primes<br>✗ The locked message c |
| `factoring` | Explain why safety depends on factoring | reason | （人工审阅） | 审阅要点：From p and q, compute φ(n) = (p − 1)(q − 1), then find d as the inverse of e modulo φ(n). / So the lock is safe only while factoring n is impractical, which is why real moduli have hundreds of digits.<br>追问：If someone learns n = 143 and φ(n) = 120, how can they find p and q by solving a quadratic equation? |

**Reference solution（总结）：** n = 143, φ(n) = 143 − 13 − 11 + 1 = 120, and gcd(7, 120) = 1; from 120 = 17·7 + 1, d = −17 ≡ 103. Locking 9 gives c = 48. Unlocking modulo 11 and 13 gives 9 and 9, so the message is 9. Fermat’s theorem for each prime (with the case p | m handled separately) and the coprime-divisor lemma prove m^(ed) ≡ m (mod n) for every m. Knowing p and q (or φ(n)) gives d, so safety rests on factoring being hard.

**Next check：** With p = 17, q = 19 and e = 5, find d, then lock and unlock a message of your choice, using the Chinese Remainder Theorem to unlock.


### 项目 10 · nt-p08 · Perfect numbers and a prime that isn’t

- **层级：** Intro undergraduate · challenging · Divisor sums, perfect and Mersenne numbers
- **经典来源：** 欧几里得的完全数构造（《几何原本》第九卷命题 36）；2ᵖ − 1 的质因数都 ≡ 1 (mod 2p)（费马在 17 世纪已注意到）；2¹¹ − 1 = 2047 = 23 × 89（16 世纪已有人指出）。
- **思路导引（中文，给老师和设计者）：** 核心想法：用唯一分解定理把"求所有因数之和"变成乘积公式 σ(n) = ∏(1 + p + ⋯ + pᵃ)，不需要列出因数。第 2 步是本题的理论核心：用"阶"的引理和费马小定理证明 2ᵖ − 1 的质因数都 ≡ 1 (mod 2p)。这样判断 127 是质数只需要一句话（最小可能的质因数是 15，而 15 > √127），分解 2047 也只需要检验一个候选数 23。第 3 步证明欧几里得的完全数构造；第 4 步证明指数是合数时 2ᵏ − 1 一定是合数，再指出"指数是质数"仍然不够（2047）。
- **用到的结论（Uses）：** Unique factorization (assumed); Fermat’s little theorem (nt-p05); the coprime-divisor lemma (nt-p04); the √n lemma (proved in Step 2); geometric sums.
- **诊断点：** 唯一分解定理与因数和公式；"阶"的引理；费马小定理的应用；√n 界限；xˢ − 1 的因式分解；"必要条件 ≠ 充分条件"。
- **图形 / 互动建议：** 因数和公式的"展开"图：(1 + 2 + 4)(1 + 7) 展开后的每一项对应 28 的一个因数，点击一项就高亮对应的因数。

**Prompt**

> A number is perfect if it equals the sum of its divisors smaller than itself. You will find a formula for divisor sums, a fast test for numbers of the form 2ᵖ − 1, and a recipe that builds perfect numbers, proving each step.

**How to think about it（`approach`，可直接放网站）**

> Use unique factorization to turn a sum over all divisors into a product of short geometric sums. For 2ᵖ − 1, prove that every prime factor q satisfies q ≡ 1 (mod 2p), using the smallest exponent d with 2ᵈ ≡ 1 (mod q). This leaves very few candidates, so 127 is proved prime and 2047 is factored with one division.

#### 1 · Divisor sums by formula

> Let σ(n) be the sum of all positive divisors of n, and s(n) = σ(n) − n. Prove that if n = p₁^a₁ ⋯ p_k^a_k (distinct primes), then σ(n) = (1 + p₁ + ⋯ + p₁^a₁) ⋯ (1 + p_k + ⋯ + p_k^a_k). Use the formula, not a list of divisors, with 28 = 2²·7, 12 = 2²·3 and 120 = 2³·3·5, to find s(28), s(12) and s(120). Is 12 perfect (s(n) = n), abundant (s(n) > n) or deficient (s(n) < n)?

字段：`s28`, `s12`, `s120`, `kind12`, `sigmaWhy`

**Reference proof（`referenceSolution`）**

> Divisors. If d | n, write n = de. By unique factorization, the prime factorization of de is that of n, so d = p₁^b₁ ⋯ p_k^b_k with 0 ≤ bᵢ ≤ aᵢ. Conversely, each such d divides n, with cofactor p₁^(a₁−b₁) ⋯ p_k^(a_k−b_k). Different exponent choices give different numbers, again by unique factorization.
>
> Formula. Expanding the product (1 + p₁ + ⋯ + p₁^a₁) ⋯ (1 + p_k + ⋯ + p_k^a_k) gives one term p₁^b₁ ⋯ p_k^b_k for each choice of exponents 0 ≤ bᵢ ≤ aᵢ, so every divisor appears exactly once, and the product equals σ(n). ∎
>
> 28 = 2²·7: σ = (1 + 2 + 4)(1 + 7) = 7·8 = 56, so s(28) = 28: perfect.
>
> 12 = 2²·3: σ = 7·4 = 28, so s(12) = 16 > 12: abundant.
>
> 120 = 2³·3·5: σ = (1 + 2 + 4 + 8)(1 + 3)(1 + 5) = 15·4·6 = 360, so s(120) = 240, exactly twice 120.

#### 2 · A test for numbers 2ᵖ − 1

> Let p be an odd prime and q a prime that divides 2ᵖ − 1. Let d be the smallest positive exponent with 2ᵈ ≡ 1 (mod q). (a) Prove that 2ᵏ ≡ 1 (mod q) exactly when d | k. (b) Conclude that d = p, and use Fermat’s theorem to prove q ≡ 1 (mod 2p). (c) Decide whether 127 = 2⁷ − 1 is prime by comparing the lower bound that (b) gives for its prime factors with √127. (d) For 2047 = 2¹¹ − 1, find the smallest number that (b) allows as a prime factor, divide, and give the other factor.

字段：`orderProof`, `prime127`, `f2047`, `cof2047`

**Reference proof（`referenceSolution`）**

> (a) Divide k = sd + r with 0 ≤ r < d. Then 2ᵏ = (2ᵈ)ˢ·2ʳ ≡ 2ʳ (mod q). If 2ᵏ ≡ 1, then 2ʳ ≡ 1, and since r < d and d is the smallest positive such exponent, r = 0, so d | k. Conversely, if k = sd, then 2ᵏ = (2ᵈ)ˢ ≡ 1.
>
> (b) 2ᵖ ≡ 1 (mod q), so d | p by (a), and d = 1 or d = p. If d = 1, then q | 2 − 1 = 1, impossible. So d = p. Since 2ᵖ − 1 is odd, q is odd, so q ∤ 2 and Fermat’s theorem gives 2^(q−1) ≡ 1 (mod q). By (a), p | q − 1. Also 2 | q − 1 because q is odd. Since p is odd, gcd(2, p) = 1, so 2p | q − 1. ∎
>
> Lemma. If n > 1 is composite, it has a prime factor at most √n. Proof: write n = ab with 1 < a ≤ b; then a² ≤ ab = n, and any prime factor of a is at most a ≤ √n.
>
> (c) Every prime factor of 127 has the form 1 + 14t with t ≥ 1, so it is at least 15. But 12² = 144 > 127, so √127 < 12. If 127 were composite, the lemma would give a prime factor at most √127 < 12, yet every prime factor is at least 15. So 127 is prime.
>
> (d) Every prime factor of 2047 has the form 1 + 22t, so the smallest allowed value is 23. Dividing, 2047 = 23·89. Every prime factor of 89 also divides 2047, so it is at least 23, and 23² = 529 > 89; by the √n lemma, 89 is prime. As (b) predicts, 89 = 1 + 22·4.

#### 3 · Euclid’s recipe for perfect numbers

> Prove: if 2ᵖ − 1 is prime, then N = 2^(p−1)(2ᵖ − 1) is perfect. Use Step 2 (c) to build a perfect number from 127.

字段：`perfect`, `recipe`

**Reference proof（`referenceSolution`）**

> Let M = 2ᵖ − 1, a prime. M is odd, so 2^(p−1) and M share no prime factor, and the factorization of N is 2^(p−1)·M¹. By Step 1,
>
> σ(N) = (1 + 2 + ⋯ + 2^(p−1))·(1 + M).
>
> The geometric sum is 2ᵖ − 1 = M, because (2 − 1)(1 + 2 + ⋯ + 2^(p−1)) = 2ᵖ − 1. And 1 + M = 2ᵖ. So σ(N) = M·2ᵖ = 2·2^(p−1)M = 2N, and s(N) = σ(N) − N = N. ∎
>
> With p = 7 and M = 127 (prime by Step 2): N = 2⁶·127 = 64·127 = 8128.

#### 4 · Why the exponent must be prime, and why that is not enough

> Prove: if k = rs with r, s > 1, then 2ʳ − 1 is a factor of 2ᵏ − 1 strictly between 1 and 2ᵏ − 1, so 2ᵏ − 1 is composite. As an example, write 2¹² − 1 = (2⁴ − 1) × M and find M from your proof, not by long division. Then decide: is “p is prime” enough to make 2ᵖ − 1 prime?

字段：`cof4095`, `compositeExp`, `primeEnough`

**Reference proof（`referenceSolution`）**

> Let x = 2ʳ. Then 2ᵏ − 1 = xˢ − 1 = (x − 1)(x^(s−1) + x^(s−2) + ⋯ + x + 1). (Multiply out: x·(x^(s−1) + ⋯ + 1) − (x^(s−1) + ⋯ + 1) = xˢ − 1, since all middle terms cancel.)
>
> Since r > 1, x − 1 = 2ʳ − 1 ≥ 3 > 1. Since s > 1, x < xˢ, so x − 1 < xˢ − 1. So 2ʳ − 1 is a proper factor and 2ᵏ − 1 is composite. ∎
>
> Example: r = 4, s = 3, x = 16: M = 16² + 16 + 1 = 273, and 15·273 = 4095 = 2¹² − 1.
>
> So 2ᵏ − 1 can be prime only when k is prime. But that is not enough: 11 is prime, and 2¹¹ − 1 = 2047 = 23·89 (Step 2 (d)).

**字段与答案**

| id | Label | 类型 | 答案 | 选项 / 测试输入 / 审阅要点 |
|---|---|---|---|---|
| `s28` | s(28) | number | **28** | 接受：`28`；应判错：`56`, `27` |
| `s12` | s(12) | number | **16** | 接受：`16`；应判错：`28`, `12` |
| `s120` | s(120) | number | **240** | 接受：`240`；应判错：`360`, `120` |
| `kind12` | 12 is … | choice | `abundant` | **✓ abundant, since s(12) = 16 > 12**<br>✗ perfect<br>✗ deficient |
| `sigmaWhy` | Prove the divisor-sum formula | reason | （人工审阅） | 审阅要点：Use unique factorization: divisors are exactly p₁^b₁ ⋯ p_k^b_k with 0 ≤ bᵢ ≤ aᵢ, each appearing once. / Explain why expanding the product produces each divisor exactly once.<br>追问：Why does the formula give σ(mn) = σ(m)σ(n) when gcd(m, n) = 1, but not in general? |
| `orderProof` | Prove that prime factors of 2ᵖ − 1 are ≡ 1 (mod 2p) | reason | （人工审阅） | 审阅要点：Prove 2ᵏ ≡ 1 (mod q) iff d | k by dividing k by d. / Show d = p, use Fermat’s theorem to get p | q − 1, and use that q and p are odd to get 2p | q − 1.<br>追问：Where does the proof use that p is prime? Where does it use that p is odd? |
| `prime127` | Is 127 prime? | choice | `yes` | **✓ Yes; every prime factor would be at least 15, which is larger than √127**<br>✗ No; it has a factor of the form 14t + 1<br>✗ The lemma cannot decide |
| `f2047` | Smallest possible prime factor of 2047 | number | **23** | 接受：`23`；应判错：`3`, `11`, `89` |
| `cof2047` | 2047 = 23 × ? | number | **89** | 接受：`89`；应判错：`23`, `87` |
| `perfect` | Perfect number built from 127 | number | **8128** | 接受：`8128`；应判错：`127`, `4064`, `16256` |
| `recipe` | Prove Euclid’s recipe | reason | （人工审阅） | 审阅要点：Use the divisor-sum formula with the coprime factors 2^(p−1) and the prime 2ᵖ − 1. / Show σ(N) = (2ᵖ − 1)·2ᵖ = 2N.<br>追问：Where does the proof use that 2ᵖ − 1 is prime? |
| `cof4095` | M in 2¹² − 1 = 15 × M | number | **273** | 接受：`273`；应判错：`4095`, `63`, `255` |
| `compositeExp` | Prove that a composite exponent gives a composite number | reason | （人工审阅） | 审阅要点：Set x = 2ʳ and factor xˢ − 1 = (x − 1)(x^(s−1) + ⋯ + 1). / Show 1 < 2ʳ − 1 < 2ᵏ − 1.<br>追问：Which factor of 2¹² − 1 does the proof give if you take r = 3 instead? |
| `primeEnough` | Is “p is prime” enough to make 2ᵖ − 1 prime? | choice | `no` | **✓ No; it is necessary but not sufficient, for example 2¹¹ − 1 = 23·89**<br>✗ Yes; that is what Step 4 proves<br>✗ Only odd primes are enough |

**Reference solution（总结）：** Unique factorization gives σ(n) = ∏(1 + p + ⋯ + pᵃ), so s(28) = 28, s(12) = 16 (abundant), s(120) = 240. The order of 2 modulo a prime factor q of 2ᵖ − 1 is p, so q ≡ 1 (mod 2p): 127 is prime since 15 > √127, and 2047 = 23·89. If 2ᵖ − 1 is prime, σ(2^(p−1)(2ᵖ − 1)) = 2·2^(p−1)(2ᵖ − 1), giving the perfect number 8128. A composite exponent rs gives the factor 2ʳ − 1, but a prime exponent is not enough.

**Next check：** Euler proved that every even perfect number has Euclid’s form. Write N = 2ᵏm with m odd, use σ(N) = 2N to show that σ(m) = m + m/(2^(k+1) − 1), and conclude that m = 2^(k+1) − 1 and that m is prime.

---

## 五、证明审阅与答案核对

**先说清楚：** 学生用的解法和参考证明都不靠穷举。下面的程序检查只是我这边的独立复核，用来确认数字和结论没有错。

**1. 程序复核答案**
- 可以计算判断的答案共 79 个（76 个数字、2 个多选、1 个单选），全部重新算过，0 处不一致。
- 其余 14 个单选是概念题，例如 "What does 2³⁴⁰ ≡ 1 (mod 341) prove?"。它们由我和独立审阅者对照证明逐一核对。

**2. 证明里的具体数字**
- 证明正文里出现的 63 类具体数字陈述都核对过，例如：
  - 6561 = 45·143 + 126；
  - 3³² ≡ 9 (mod 341)；
  - 倒水序列每一步的水量。
- 一般定理在大量例子上做了抽查：
  - 斜边小于 300 的本原勾股数，与公式生成的完全一致；
  - 模数 2–12 的所有同余方程组，都符合"有解 ⇔ gcd | a − b"；
  - RSA：143 个可能的消息全部能正确解锁；
  - 校验码：随机 2 万个编码，所有单个错误和相邻互换都能查出；
  - 两种面额的凑数公式：5 组数都对；
  - "模 4 余 3 的数一定有模 4 余 3 的质因数"：5000 以内全部成立；
  - 取整函数引理也抽查过。

**3. 网站判分程序**（线上 2026-10-09 版，规则 `written-precision-3`）
- 78 个正确写法（包括 `-3`、`5/13`）全部判对；
- 175 个典型错误答案全部判错；
- 没有任何答案触发"数字格式检查"的误拦。

**4. 独立审阅（两轮）。** 我另外请了一个审阅者（一个单独的 AI 代理），按"本科初等数论课"的标准逐条挑错，审阅全部 43 步证明。

- **第一轮**发现 1 处错误、8 处较大的漏洞、11 处小问题。已全部修改。例子：
  - **P5 的错误：** 原文说"不分解就证明了 341 是合数"，可是计算时用到了 341 = 11 × 31，论证是循环的。现在补了一段完全不用因数的反复平方计算：3⁸ ≡ 82，3¹⁶ ≡ 245，3³² ≡ 9 (mod 341)，最后得到 3³⁴⁰ ≡ 56。
  - **P10 的漏洞：** 原文用到"Q 能写成质数的乘积"，这一点没有证明过。现在改成"最小反例"证明，只用到良序原理。
  - **P4 的漏洞：** 解在模 lcm 意义下唯一，原来少了几步：gcd(m′, n′) = 1、n′ | m′k ⇒ n′ | k、gm′n′ = lcm(m, n)。现在全部补上了。
  - **P4 的歧义：** 逆元只确定到模数的倍数，所以"构造值 233"有歧义。现在规定逆元取 1 到 m − 1 之间的数。
- **第二轮**复查修改后的版本，发现我在第一轮修改时引入了一个新错误：P2 审阅要点里写"倒了 3 次"，其实是倒 4 次、7 升壶装满 3 次。这个错误和几处措辞都已改正。第二轮的结论是：除这一处外，参考证明中没有错误或断裂的地方。

**5. 局限（批判性说明）**

1. **三个基础定理没有在这 10 题里证明。** 它们是：
   - 算术基本定理（唯一分解）；
   - 欧几里得引理（质数整除乘积，就整除其中一个因数）；
   - 一般形式的贝祖定理。

   P2 到 P9 中有多处用到它们。例如 P2 第 4 步和 P9 用到"a | bj 且 gcd(a, b) = 1 ⇒ a | j"，这是贝祖定理的推论；P7、P8 用到唯一分解。JSON 的 `uses` 和 `moduleDraft.prerequisite` 都写明了。

   这是本组题在逻辑上最大的缺口。**建议再加一个"基础定理"project：** 先用扩展欧几里得算法证明一般的贝祖定理，再推出欧几里得引理，最后证明唯一分解。这样整个模块就能自成体系。需要的话我可以按同样标准写。

2. **证明质量要靠审阅。** 27 个说理字段（占 120 个字段的 22%）是学生写证明的地方，自动判分只覆盖数字部分。每个说理字段的审阅要点（`reviewCriteria`）都已经和参考证明对齐。但 AI 审阅学生证明的可靠性，目前没有数据。建议先找几位学生试做，人工抽查 AI 的评语。

3. **"不穷举"不等于"没有计算"。** 保留的计算都是定理指定的少量计算。只有两处还需要逐项检查：
   - P1 的多选题，要逐个检查 5 个选项是否整除 84；
   - P2 的多选题，有 1 L 到 9 L 共 9 个选项。

   不过学生判断时用的是已经证明的判据（"s | 84"、"是 3 的倍数"），不是靠试。

4. **一处判分偏宽。** P7 的单位圆坐标，题目要求写分数，但判分程序也接受两位小数（如 0.38）。题干里已经写明这一点。

---

## 六、版权自查

**1. 思想都是公有领域。**

| 题目思想 | 来源 | 年代 |
|---|---|---|
| 欧几里得算法、质数无穷多、勾股数公式、偶完全数的构造 | 欧几里得《几何原本》 | 约公元前 300 年 |
| "物不知数" | 《孙子算经》 | 约 3–5 世纪 |
| 费马小定理；2ᵖ − 1 的质因数的形式 | 费马 | 17 世纪 |
| 两种面额的"凑数"结论 | 西尔维斯特 | 1884 年 |
| RSA | 发表于 1977 年 | 相关美国专利已于 2000 年到期 |

- 置换法证明费马小定理、"阶"的引理、勾股数分类证明，都是数论教材里的标准证明思路。
- 美国著作权法第 102(b) 条不保护思想、方法和数学原理。受保护的是某本书的具体文字和编排。

**2. 文字是新写的。**
- 题干、步骤、43 段参考证明，都是这次用自己的话写的，没有照抄或改写任何教材、讲义或网站的原文。
- 《孙子算经》只用了原题的数字，英文是我们自己的转述。

**3. 刻意避开了"最出名的那组数"。** 和 v1 相同：

| 没有用 | 原因 | 我们改用 |
|---|---|---|
| gcd(1071, 462) | 维基百科上欧几里得算法的示例 | gcd(924, 588) |
| 3 加仑和 5 加仑水壶 | 一部电影里的场景 | 7 升和 11 升 |
| 6、9、20 块装 | 和某快餐品牌联系在一起 | 5 张和 7 张一包的门票 |
| RSA 的 p = 61、q = 53 | 维基百科的示例 | p = 11、q = 13 |
| 真实书号 0-306-40615-2 | 维基百科的校验码示例 | 虚构的商品编码 |

**4. 没有品牌、真人和真实机构。** 社区中心、科学展、博物馆、学校商店、种子图书馆、数学社都是虚构的。

**5. 和 Quidence 现有题库比对。** 我把这 10 个项目（连同参考证明）和网站现有的全部题库逐一比较，计算"连续 5 个词完全相同"的片段比例：
- 最高 6.7%（P2）；
- 重合的只是 "x = 3 and y = 2"、"so there is no solution" 这类常用说法。

**局限：**
- 像"两个水壶""孙子问题""341"这样的经典题，很多教材都有相似版本。它们的思想不受保护，我们的表达是原创的，所以风险低。
- 我无法检索收费教材，不能保证没有巧合相同的数字组合。
- 法律判断以律师意见为准。建议保留每题的 `provenance` 说明。

---

## 七、上线建议

1. **网站要加一个小功能。** 现在网站上 project 的每一步只有 `title`、`prompt`、`fields` 三个键，没有"每步的参考证明"。v2 给每一步加了 `referenceSolution`。
   - **建议：** 学生提交某一步之后，在该步下面显示一个可以展开的 "See a full proof"。
   - **如果暂时不改前端：** 可以把各步证明按顺序拼接，放进现有的 `solution`。
2. **`approach` 放在题目开头**，作为 "How to think about it"。教学上，也可以等学生第一次卡住时再显示。
3. **按学习路线的顺序开放。**
   - P5、P6、P8 用到 P4 的"互素因数之积整除"引理和 P5 的费马小定理；
   - P5 用到 P3 的模 11 检验。
   - 如果学生跳着做，请在题目开头显示 `uses` 里的依赖。
4. **说理字段。** 每个 reason 字段已经补上 `onMismatch`，格式和现有题库一致。如果要做诊断题，可以去掉提示较强的句子，例如 "Use 120 = 17·7 + 1"。
5. **西语版。** 新增文字较多（43 段证明），要加进西语词库。术语请保持一致：
   - congruence → congruencia
   - modular inverse → inverso modular
   - order (of 2 mod q) → orden
   - perfect number → número perfecto
6. **多选题。** P1 的 "Other tile sides" 和 P2 的 "Amounts" 是多选题，请确认它们走现有 multi 字段的判分方式（全部选对才算 matched）。

---

## 参考来源

- [17 U.S.C. §102（govinfo）](https://www.govinfo.gov/content/pkg/USCODE-2024-title17/html/USCODE-2024-title17-chap1-sec102.htm)
- 历史出处属于常识性数学史：欧几里得《几何原本》第七、九、十卷；《孙子算经》；费马、欧拉、西尔维斯特的原始结果。题目文字和证明文字都没有引用现代教材。
