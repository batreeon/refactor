# 阅读《重构：改善既有代码的设计》
假装记笔记
> 每次都尽量小步前进

>临时变量往往会带来麻烦。它们只在对其进行处理的代码块中有用，因此临时变量实质上是鼓励你写长而复杂的函数。
>
>软件的性能通常只与代码的一小部分相关，改变其他的部分往往对总体性能贡献甚微。（有点像Amdahl定律）                 
>
>当然，“大多数时候”不等同于“所有时候”。有时，一些重构手法也会显著地 影响性能。但即便如此，我通常也不去管它，继续重构，因为有了一份结构良好的代码，回头调优其性能也容易得多。 
>
>因此对于重构过程的性能问题，我总体的建议是:大多数情况下可以忽略它。如果重构引入了性能损耗，先完成重构，再做性能优化。
>
>但在事情变复杂时，我的第一反应就是采用更小的步子。怎样算变复杂呢，就是当重构过程有测试失败而我又无法马上 看清问题所在并立即修复时，我就会回滚到最后一次可工作的提交，然后以更小的步子重做。这得益于我如此频繁地提交。特别是与复杂代码打交道时，细小的步子是快速前进的关键。 
>
>返回副本的原因是，我不想修改传给函数的参数，我总是尽量保持数据不可变(immutable)——可变的状态会很快变成烫手的山芋。
>
>编程时，需要遵循营地法则:保证你离开时的代码库一定比来时更健康。
>
>好代码的检验标准就是人们是否能轻而易举地修改它。
>
>重构(名词):对软件内部结构的一种调整，目的是在不改变软件可观察行为的前提下，提高其可理解性，降低其修改成本。
>
>重构(动词):使用一系列重构手法，在不改变软件可观察行为的前提下，调整其结构。
>
>如果有人说他们的代码在重构过程中有一两天时间不可用，基本上可以确定，他们在做的事不是重构。
>
>重构之后的代码不一定与重构前的代码行为完全一致。比如提炼函数，函数调用栈会改变；搬移函数，接口声明可能会改变。但是对于用户关心的行为而言，不应该有任何改变。
>
>重构不等于性能优化。重构是为了代码更容易理解，程序可能变快可能变慢。性能优化，完全是为了程序运行地更快，这有可能导致代码完全无法理解。
>
>添加新功能时不要改变既有代码，为新代码添加测试。重构时不要添加新功能，除非发现漏测或者接口改变，否则也不应改变测试。
>
>代码结构的流失有累积效应。越难看出代码所代表的设计意图，就越难保护其设计，于是设计就腐败得越快。
>
>尽量减少重复的代码。不同的地方有功能相同的代码时，当你改动代码，往往需要更多的工作量，因为你需要改动多处，这也增加了出错的风险。
>
>通过重构，就把对代码的理解转移到了代码本身。这份知识会保存得更久。
>
>### 何时重构
>* 添加新功能时重构。如果觉得新功能添加起来很困难，稍微修改一下程序可以使得新功能添加变得容易，那么就先重构。
>* 帮助理解代码。细小的重构后可以帮助你更好的理解代码，发现更复杂的问题。
>* 捡垃圾式重构。当你在完成现有的任务时发现了垃圾代码，如果很容易改动那就可以顺手重构，如果重构的工作量较大，可以先记下来等任务完成后再重构。一次小小的改动不能彻底完成重构，但是可以使得每次代码都在不被破坏的情况一点点变好。
>* 重构不一定非得专门排期来做，每次完成任务时，为了使任务更容易完成、使未来的工作更轻松，都可以逐步重构。
>* 每次要修改代码时，应先考虑是否可以重构，使得修改动作变得更容易。已有的代码不应该被视为“完成”状态，需要时，已有的代码就应该做出改变。
>* 即使一些大型重构，也不太建议专门排期来做（不是说不能专门做重构），可以采用渐进式的，在未来一段时间里逐渐的完成重构的目标。
>* 重构有助于代码review。重构可以加深代码理解。（这一块没看太懂）
>* 没有必要把重构这项工作告诉PM🤣。
>### 何时不应该重构
>如果代码没人看、没人要改、不需要理解它，那完全没必要重构。毕竟重构的目的就是为了让人看懂代码。
>重写比重构还容易，那就别重构了。但是这个很难提前判定难易。


原书的代码示例是javascript版本的，[这个文件夹](./javascript/)记录了一部分javascript语言本身的内容。***建议在浏览器控制台中运行这部分的代码***。

<details>
    <summary>
        <font size="5" color="white">
            <b>ch1 重构，第一个示例</b>
        </font>
    </summary>

### <font size="4"><b>1.1 - 1.5节</b></font>
[1_1.js](./ch1/1_1.js)
* 原始的一段代码

[1_4.js](./ch1/1_4/1_4.js)
* 将计算一个表演的花费提炼成函数

[1_4_2.js](./ch1/1_4/1_4_2.js) [1_4_3.js](./ch1/1_4/1_4_3.js)
* 函数两个参数，一个参数可以用另一个参数计算出来，删除一个参数，并使用内联替换临时变量

[1_4_4.js](./ch1/1_4/1_4_4.js)
* 将计算credits的逻辑提炼成函数将format提炼成函数，避免使用临时变量，临时变量值在局部使用，很容易导致代码变长变复杂
* 将所有thisAmuount都变成内联形式
* 将format这个较通用的名称修改为usd，函数名更加清晰，可以让人不用看函数体就知道函数的用处。并且将除以100放到usd里。美分美元转换

[1_4_5.js](./ch1/1_4/1_4_5.js)
* 将计算credits总和的逻辑提炼出来，拆分循环，提炼成函数，然后使用内联变量

[1_4_6.js](./ch1/1_4/1_4_6.js)
* 将计算totalAmount的逻辑提炼出来，拆分循环，提炼成函数，然后使用内联变量

至此，原始的1_1.js一大段让人头疼的代码，已经被一点一点地拆分到几个小函数里了。

### <font size="4"><b>1.6节</b></font>
想把计算阶段和格式化阶段拆分开来    
第一阶段计算详单「所需的数据」  
第二阶段将数据渲染成文本或html  
第一阶段会创建一个中转数据，然后把它传递给第二阶段

[1_6_1.js](./ch1/1_6/1_6_1.js)
* 将打印详单的的代码提出来。命名renderPlainText

[1_6_2.js](./ch1/1_6/1_6_2.js)
* 将invoice中的customer和performance放到data里面去，这样就可以删去invoice了 。同时注意totalVolumeCredits和totalAmount都是嵌套在renderPlainText中的，并且使用了invoice变量，现在这两个函数的参数也需要从data中获取了，需要修改这两个函数。

[1_6_3.js](./ch1/1_6/1_6_3.js)
* 将plays里的playname和playtype也存到data里。具体是存在performance的play字段里
* playFor函数要使用plays变量，因此将其嵌套在statement函数中，这样renderPlainText就可以删除plays参数了
* 接下来将原函数中要用到performance.name和performance.type的地方都替换了（renderPlainText，amountFor和volumnCreditsFor函数中），替换成data.performances[i].name或type

[1_6_4.js](./ch1/1_6/1_6_4.js)
* 将amountFor函数搬移出来

[1_6_5.js](./ch1/1_6/1_6_5.js)
* 搬移columnCreditsFor观众量积分函数

[1_6_6.js](./ch1/1_6/1_6_6.js)
* 将totalAmount和totalVolumeCredits函数，搬移到了statement函数中。其实可以改造函数体使用外部的statementData变量，但是采用了传递一个参数来避免修改函数体。

[1_6_7.js](./ch1/1_6/1_6_7.js)
* 使用数组的reduce方法改造totalAmount和totalVolumeCredits函数
* 把准备statement数据又提炼成了一个函数。现在statement函数把数据准备好。然后render不再进行计算，只需要接受数据，将数据组织成目标形式就可以了。

[1_6_8](./ch1/1_6/1_6_8/)
* 将createStatementData函数拆分到另一个文件里。
* ***使用module.exports导出函数，使用require引用其他文件中的函数***

[1_6_9](./ch1/1_6/1_6_9/)
* renderHtml()

### <font size="4"><b>1.8节</b></font>
尝试使用类来组织单个performance，并将花费和用户积分的计算组织为类的方法。并且使用多态取代条件表达式，避免使用多分支结构。

[1_8_1](./ch1/1_8/1_8_1/)
* 使用类来组织单个performance，并将花费和用户积分的计算组织为类的方法。
* 还没有使用多态。

[1_8_2](./ch1/1_8/1_8_2/)
* 使用子类代替父类，子类实现各自的函数，实现多态。这样新增类时只需要实现新增的类，再只需修改子类生产函数。
* 将多个函数都会有的分支结构，集中到了子类生产函数中。

</details>