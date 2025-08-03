---
描述：在实施/编码时包括这些规则。
全局变量：
始终应用：true
---
每次代码实现/更改之前，请务必做两件事：
a. 阅读并理解 `docs/` 和 `tasks/` 中的文档
a. 从`src`和其他地方的代码中获取所需的代码上下文。

# 实施（ACT 模式/代码模式）：
<PROGRAMMING PRINCIPLES>
- algorithm_efficiency：使用最有效的算法和数据结构
- modularity：编写模块化代码，将复杂的逻辑分解成更小的原子部分。尽可能将其分解成类、文件、目录、模块、函数等。
- file_management：将长文件分解为更小、更易于管理且功能更少的文件。
- import_statements：更喜欢从其他文件导入函数，而不是直接修改这些文件。
- file_organization：将文件组织到目录和文件夹中。
- reuse：更喜欢重用现有代码而不是从头开始编写。
- code_preservation：保留有效的组件。如无必要，请勿修改正在运行的组件。
- systematic_sequence：先完成一个步骤，再开始另一个步骤。保持功能的系统顺序。
- design_patterns：应用适当的设计模式，以实现可维护性。规划未来的变化，实现可扩展、灵活、可扩展且可维护的代码。
- proactive_testing：任何功能代码都应附带适当的测试代码，如<TESTING>中所示。
</PROGRAMMING PRINCIPLES>

<SYSTEMATIC CODE PROTOCOL>
[步骤：1]
<ANALYZE CODE>
<DEPENDENCY ANALYSIS>
- 哪些组件会受到影响？
- 存在哪些依赖关系？
- 这是局部的还是会影响核心逻辑？
- 哪些功能会受到影响？如何影响？
- 这一变化将产生哪些连锁效应？
</DEPENDENCY ANALYSIS>
<FLOW ANALYSIS>
- 在提出任何变更之前，对相关用例从入口点（例如，函数调用、变量初始化）到所有受影响代码的执行进行完整的端到端流程分析。
- 跟踪所有涉及组件的数据和逻辑流，以了解其全部范围。
</FLOW ANALYSIS>
- 彻底记录这些依赖关系，包括@memory.md 指定的文件中函数或逻辑的具体用法
</ANALYZE CODE>

[步骤：2]
<PLAN CODE>
- 如果需要，启动<CLARIFICATION>流程。
- 使用<STEP BY STEP REASONING>在编码前概述详细计划，包括组件依赖关系和架构考量。使用<REASONING PRESENTATION>解释所有代码更改、每个部分的功能及其对其他区域的影响。
<STRUCTURED PROPOSALS>
- 提供一份提案，具体说明：1）哪些文件、功能或代码行被更改；2）为什么需要更改（即错误修复、改进或新功能）；3）所有直接受影响的模块或文件；4）潜在的副作用；5）任何权衡的详细解释。
</STRUCTURED PROPOSALS>
</PLAN CODE>

[步骤：3]
<MAKE CHANGES>

1. 在@memory.md指定的文件中记录当前状态
- 目前正在进行什么工作？
- 当前的错误/问题是什么？
- 哪些文件会受到影响？

2. 每次只规划一个逻辑变更
<INCREMENTAL ROLLOUTS>
- 一次一个逻辑特征
- 但通过在代码的其他部分中适应适当的变化来完全解决这一变化。
- 调整此更改创建的所有现有依赖关系和问题。
- architecture_preservation：在提交更改之前，确保所有新代码与现有项目结构和架构无缝集成。请勿进行破坏现有代码组织或文件的更改。
</INCREMENTAL ROLLOUTS>

3.模拟测试
<SIMULATION ANALYSIS>
- 通过执行试运行、跟踪调用或其他适当方法来模拟用户交互和行为，以严格分析所提议的更改对预期和边缘情况的影响。
- 对所有潜在的副作用产生反馈。
</SIMULATION ANALYSIS>
<SIMULATION VALIDATION>
- 除非模拟通过并验证所有现有功能都得到保留，否则不要提出更改，如果模拟中断，请在继续之前立即提供修复。
</SIMULATION VALIDATION>
- 如果模拟测试通过，则进行实际实施。
</MAKE CHANGES>

[步骤：4] 执行<TESTING>。

[步骤：5] 循环 1-4 并实施所有更改
- 系统地、逐一地纳入所有变化。
- 验证更改并逐一测试。

[步骤：6] 优化已实现的代码
- 在所有更改都经过测试和验证后，优化实施的代码。

</SYSTEMATIC CODE PROTOCOL>

<REFERENCE>
- 参考相关文档和最佳实践
- 如果需要参考文档或最佳实践，请使用<WEB USE>
</REFERENCE>

# 测试（务必在实施后写入测试）[ACT/代码模式]
<TESTING>

<DEPENDENCY BASED TESTING>
为任何新功能创建单元测试。从 <ANALYZE CODE> 运行所有测试，以确认现有行为仍然符合预期。
</DEPENDENCY BASED TESTING>
<NO BREAKAGE ASSERTION>
提出修改建议后，请自行运行测试并验证其是否通过。不要依赖我来做这件事，并确保我的代码不会被破坏。
</NO BREAKAGE ASSERTION>

1. 将测试逻辑与功能代码实现分开编写，以保持代码整洁且易于维护

<TEST PLAN>
- 根据需求和期望结果，为添加/更新的功能制定足够详尽的测试计划。
- 定义涵盖边缘情况的综合测试场景
- 为项目堆栈指定适当的验证方法
- 建议监控方法来验证解决方案的有效性
- 考虑潜在的回归以及如何防止它们
</TEST PLAN>

2. 务必为任何新增的关键功能编写测试代码。初始测试生成时，请使用<DEPENDENCY BASED TESTING>和<NO BREAKAGE ASSERTION>。然后使用<TEST PLAN>编写代码进行全面测试。
3. 按照@memory.md 中指定的方式记录测试
</TESTING>

- 实施新事物时，要坚持不懈，严格执行所有细节。直到测试成功后再停止，而不是在此之前。

---
每次代码实现/更改后，请务必做两件事：
a. 更新 `src` 中其他可能受影响的代码以及其他地方的代码。
b. 更新 `docs/` 和 `tasks/` 中的文档。