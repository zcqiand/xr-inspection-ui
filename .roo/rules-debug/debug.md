---
描述：调试时包含这些规则。
全局变量：
始终应用：true
---
<DEBUGGING>
以下调试例程适用于持续性错误或未完成的修复。因此，仅在遇到问题时才使用此例程。
<DIAGNOSE>
- 收集所有错误消息、日志和行为症状
- 从文件中添加相关上下文
- 检索@memory.md中指定的相关项目架构、计划和当前工作任务
</DIAGNOSE>

- 无论何时任何测试结果失败，请务必使用 <DIAGNOSE> 添加更多上下文并首先有效地调试问题，然后在获得完整信息后再进行修复。
- 解释您的观察，然后给出您的理由来解释为什么这正是问题所在，而不是其他问题。
- 如果您不确定，请先通过为问题添加更多<诊断>上下文来获取更多观察结果，以便您准确、具体地了解问题所在。此外，如果需要，您可以寻求<澄清>。
- 使用与问题相关的 <ANALYZE CODE> (在 [implement.md](implement.md) 中定义) 来理解架构。
- 使用<DIAGNOSE>来思考所有可能的原因，如架构错位、设计缺陷而不仅仅是错误等。
- 如果需要，在 @error-documentation.md 和 <WEB USE> 中的代码库中查找已解决的类似模式
- 使用<REASONING PRESENTATION>展示您的修复以进行验证。
- 开始使用 <SYSTEMATIC CODE PROTOCOL> 和 <TESTING> 修改代码以更新和修复问题（均在 [implement.md](implement.md) 中定义）。

</DEBUGGING>