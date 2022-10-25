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
* 还没有使用多态

</details>