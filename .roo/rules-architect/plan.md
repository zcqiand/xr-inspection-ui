---
描述：始终包含这些规则。
全局变量：
始终应用：true
---
---
在执行每个规划/架构任务之前，请务必做三件事：
1. 阅读 `docs/` 中现有的文档：`docs/architecture.md`，`docs/product_requirement_docs.md`，`docs/technical.md`
2. 读取 `tasks/` 中的计划和相关任务规划及上下文：`tasks/active_context.md`，`tasks/tasks_plan.md`
3. 从 `src` 中的代码文件和其他地方的代码中获取所需的解决方案上下文。
---
# 以下是需要遵循的规划工作流程：

1. 了解要求：
<CLARIFICATION>
- 始终要求澄清和跟进。
- 确定未指定的要求并询问详细信息。
- 充分了解问题的各个方面并收集细节以使其非常精确和清晰。
- 询问所有需要提出的假设和假定。消除所有模糊和不确定性。
- 提出我没有想到的解决方案，即预测我的需求和需要指定的事情。
- 只有在拥有百分之百的清晰度和信心之后，才能继续寻求解决方案。
</CLARIFICATION>

2.制定解决方案：
<STEP BY STEP REASONING>
<DECOMPOSE>
- 为解决方案制定元架构计划。
- 将问题分解为关键概念和较小的子问题。
</DECOMPOSE>
1. 思考解决问题的所有可能方法。
2. 建立评估标准和权衡来评估解决方案的优点。
3. 找到最优解、使其最优的标准以及所涉及的权衡。
<WEB USE> 
如有需要，可以使用 use_mcp_tool 命令访问网页，特别是使用 Perplexity 的搜索工具。例如：
<use_mcp_tool>
<server_name>perplexity-mcp</server_name>
<tool_name>搜索</tool_name>
<arguments>
{
  "param1": "value1",
  "param2": "value2"
}
</arguments>
</use_mcp_tool>
</WEB USE>

<MULTI ATTEMPTS>
1. 严格推理出解决方案的最优性。
2. 质疑每一个假设和推论，并用全面的推理来支持它们。
3. 想出比当前解决方案更好的解决方案，结合不同解决方案的最强方面。
4. 重复该过程 <ULTI ATTEMPTS> ，将不同的解决方案提炼并整合为一个，直到找到一个强有力的解决方案。
5. 如有需要，可使用<WEB USE>进行研究。
</MULTI ATTEMPTS>
</STEP BY STEP REASONING>

3.解决方案验证：

<REASONING PRESENTATION>
- 提供尽可能详细的计划。
- 逐步分解解决方案，并清晰地思考每个步骤的细节。
- 推理出其相对于其他有希望的解决方案的最优性。
- 明确地告诉您所有的假设、选择和决定
- 解释解决方案中的权衡
- 给出解决方案后，如有必要，请用自己的话重述我的问题
</REASONING PRESENTATION>
- 实施前，验证<REASONING PRESENTATION>产生的解决方案。

---
# 计划特点：
1. 该计划应：
a. 可扩展性：在当前规划的基础上，可以轻松构建更多代码。并且，未来扩展也将得到良好的支持。预测未来的功能，并使规划能够适应这些功能。
b. `详细`：计划非常详细，考虑到了受影响的每个方面以及所有可能的方式。
c. `健壮`：针对错误场景和故障情况进行规划，并对可能发生的故障情况进行回退。   
d. `准确`：每个方面都应该相互同步，各个组件应该正确，接口应该正确。   
---

每次规划/架构任务完成后，务必做两件事：
1. 将计划记录到现有文档中，并更新 `docs/` 中的文件：`docs/architecture.md`，`docs/product_requirement_docs.md`，`docs/technical.md`
2. 在 `tasks/` 中记录计划和相关任务规划及上下文：`tasks/active_context.md`，`tasks/tasks_plan.md`