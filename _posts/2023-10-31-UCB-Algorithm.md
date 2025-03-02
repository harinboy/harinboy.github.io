---
layout: post
title:  "Multi-Armed Bandit and UCB Algorithm"
date: 2023-11-01 21:00
category: reinforcement-learning
math: true
---

This post is an English translation of this [post](https://infossm.github.io/blog/2023/04/23/UCB-Algorithm/),
which is a Korean post I wrote with the support of Samsung Software Membership.

# Introduction

&nbsp;&nbsp;&nbsp;&nbsp;
In this post, I will introduce the Multi-Armed Bandit problem, which is a problem about making good decisions in the face of uncertainty. 
I will also derive and prove the UCB algorithm, one of the algorithms that solve this problem, in an easy and intuitive way possible.
Some basic knowledge of probability and statistics (e.g., probability distribution, expectation, sample mean) is required, but I did not assume that readers would have any additional background knowledge.

# Problem Description

### A Machine That Spits Out Money?

&nbsp;&nbsp;&nbsp;&nbsp;
Here is a machine that has two buttons. 
Surprisingly, the machine gives you money when you press the buttons!
Moreover, you luckily have 100 chances to press the buttons!!

&nbsp;&nbsp;&nbsp;&nbsp;
As you do not know how much money each button gives you, you start by pressing the left button a few times.
10 cents, 10 dollars, 10 cents...
You also press the right button a few times.
5.01 dollars, 5.02 dollars, 4.98 dollars... Huh?
Suddenly, you realize that you need to be more strategic with the remaining chances.
It seems that the two buttons give you different amounts of money.
Especially the means of the amounts may differ, so you want to press the button with the higher mean more often.
Of course the problem is, you do not know which one is the "better button".
What should you do to earn as much as possible?

### Mathematical Definition of the Multi-Armed Bandit Problem

&nbsp;&nbsp;&nbsp;&nbsp;
The Multi-Armed Bandit or K-Armed Bandit problem consists of a set of options (actions) denoted as $A=\lbrace 1, 2, ..., K\rbrace$, which I represented as buttons in the earlier example, each with a probability distribution of reward $r(a)$ $(a\in A)$, and $T$, the number of times you can choose the options.
When you choose an option $a$, an independent random sample of $r(a)$ is given as a reward.
The objective is to maximize the total reward obtained over $T$ rounds.
Importantly, information about $r(a)$ is not known to the one making the choices.
The term "Multi-Armed" came from an example that pulls the levers (arms) of slot machines, instead of buttons.

&nbsp;&nbsp;&nbsp;&nbsp;
Without loss of generality, I assume that every option gives a real valued reward between 0 and 1.
In other words, $r(a)\in[0, 1]$.

&nbsp;&nbsp;&nbsp;&nbsp;
If one has information about $r(a)$, the best strategy is to choose the option with the highest expected reward $T$ times.
To express this more conveniently, I will denote the expectation of reward for each option and the option with the highest expectation as the following.

$\mu_ a=\mathbb{E}[r(a)]$: The expectation of reward for each option $(a\in A)$.  
$a^\star =\text{argmax}_ {a\in A}(\mu_ a)$: Option $a\in A$ with the highest $\mu_ a$.
For simplicity, I assume it is unique.  
$\mu^* =\max_ {a\in A}(\mu_ a)$: The expected reward of the best option.

&nbsp;&nbsp;&nbsp;&nbsp;
If one has information about the reward probability distributions $r$, one can choose $a^\star$ all the time, earning $T\mu^\star$ reward in expectation after $T$ selections.
Unfortunately, we don't have much information about $r$, so what should we do?
The only way is to gain some information of $r$ by making some actions and observing samples of $r(a)$.
Ultimately, one will have to risk some loss by trying out some options, and then try to choose the best one based on the gained information.

&nbsp;&nbsp;&nbsp;&nbsp;
If $\mu^\star$ is small in the first place, then the maximum obtainable reward is also small, which means that there is no algorithm that guarantees certain amount of reward.
Therefore, when analyzing a specific algorithm, the focus is on how much it loses compared to the best possible result, $T\mu^* $.
To express this, I will introduce the concept of regret.
Supposing that you have chosen $a_ 1, a_ 2, ..., a_ T$ in the given order, the regret $R$ is defined by

$$R=T\mu^* -\sum_ {t=1}^{T}\mu_ {a_ t}$$

The regret incurred by one selection is $\mu^\star -\mu_ {a_ t}$.
Since $\text{argmax}_ {a\in A}(\mu_ a)$ is assumed to be unique, the regret increases every time an option other than $a^* $ is chosen.

&nbsp;&nbsp;&nbsp;&nbsp;
Let $\Delta_ a=\mu^* -\mu_ a$ be the regret that occurs when selecting the option $a$ and $N_ {a, T}$ be the number of times option $a$ was taken after all $T$ selections.
Then the regret can be expressed as the following:

$$R=\sum_ {t=1}^{T}\Delta_ {a_ t}=\sum_ {a=1}^{K}\Delta_ a N_ {a, T}$$

&nbsp;&nbsp;&nbsp;&nbsp;
For example, suppose you pressed the two buttons of the machine described earlier fifty times each.
Then you find out that one gives you 4 dollars in average and the other gives you 6 dollars in average.
It will feel like that you lost 2 dollars per each of the fifty wrong choices, which makes 100 dollars in total.
This 100 dollars is the regret in this case.
Our goal is to create an algorithm with small regret.

&nbsp;&nbsp;&nbsp;&nbsp;
I assumed that $r(a)\in[0, 1]$, so the maximum regret of a single selection is 1 and the maximum total regret is $T$.
How much can it be reduced?
Will it be possible to go further than simply reducing some constant factor, achieving a much lower regret in terms of complexity?
Surprisingly, the UCB algorithm guarantees the expected regret to be $O(\sqrt{KT \log T })$.
Of course, Bandit problems are stochastic by nature, so even a good algorithm may experience huge regret in an extremely unlucky case.
However, UCB algorithm can also guarantee that when the failure is allowed with a probability $\delta>0$, it achieves regret at most $O\left(\sqrt{KT\log (KT/\delta)}\right)$ with probability at least $1-\delta$.
In other words, you can reduce the probability of getting regret larger than the scale of $\sqrt{T}$ to be as small as you want.

Side-note: "Action" is a widely-used term, but in this post I will use the word "option" instead because I think it is more intuitive in this case.
Also some articles define what I defined to be $R$ or regret as pseudo-regret.
In such cases, "regret" is a concept that the expectation $\mu_ {a, t}$ is replaced with sampled rewards. 
Still the expectation of regret is pseudo-regret such articles analyze pseudo-regret in the end, so I will keep my definition of regret.

# The "Seemingly" Best Option

&nbsp;&nbsp;&nbsp;&nbsp;
You have already pressed the buttons several times.
The first strategy you can now think of is to keep selecting the best option based on the results you have observed so far for the rest of the rounds.
To express this, I will define notations that denote the number of times a specific option is chosen up to time $t$ and the average of rewards that are given when the option is chosen.

$N_ {a, t} = \sum_ {i=1}^{t}\mathbb{1}(a_ i = a)$: The number of times option $a$ has been chosen until time $t$.  
$\hat{\mu}_ {a, t} = \frac{\sum_ {i=1}^{t}r_ i\mathbb{1}(a_ i=a)}{N_ {a, t}}$: The average of rewards obtained by choosing option $a$ until time $t$.

&nbsp;&nbsp;&nbsp;&nbsp;
Here, $\mathbb{1}(a_ i = a)$ is a function that equals 1 if the $i$th choice is option $a$, and 0 otherwise. $r_ i$ represents the reward obtained at the $i$th choice.
$N_ {a, t}$ and $\hat{\mu}_ {a, t}$ are some of the information you have when you make the $t+1$th action.
To make sure that $\hat{\mu}_ {a, t}$ is well-defined, let's suppose that the each of the options $1, 2, ..., K$ is selected once for the first $K$ rounds, and then define $\hat{\mu}_ {a, t}$ for $t\geq K$.

&nbsp;&nbsp;&nbsp;&nbsp;
One possible way to choose the seemingly best option is to choose the option that gave the highest average reward so far.
Using the notation above, it means believing in and choosing $\text{argmax}_ {a\in A} \hat{\mu}_ {a, t}$.

&nbsp;&nbsp;&nbsp;&nbsp;
However, there is a concern. What if the option chosen this way is not the best one, and you end up losing a lot?
Does it mean that you should try other options a little bit more?
On the other hand, if the chosen option is in fact the best one, the regret increases every time you try another one as a test.
If you are too confident about the values $\hat{\mu}_ {a, t}$, being wrong incurs too much regret.
If you are too skeptical about the values $\hat{\mu}_ {a, t}$, you might lose some information they give.
So, how much should you trust $\hat{\mu}_ {a, t}$?

# Confidence Interval

&nbsp;&nbsp;&nbsp;&nbsp;
Now that you have constructed $\hat{\mu}_ {a, t}$ based on the observed rewards up to time $t$, it's time to think about how reliable these values are.
How can one mathematically define that the value is reliable? 
There are several concepts correspond to this idea in statistics, and the concept I introduce is the confidence interval.

&nbsp;&nbsp;&nbsp;&nbsp;
A confidence interval is a range within which the value in question, in this case $\mu_ a$, exists with a high probability.
This concept is what is expressed as the margin of error in surveys, such as saying that the margin of error is certain percentage at the 95% confidence level.
For a given probability $\delta$, if the absolute error between $\mu_ a$ and $\hat{\mu}_ {a, t}$ is mathematically less than $\beta_ {a, t}(1-\delta)$ with probability at least $1-\delta$, the confidence interval is:

$$\mu_ a \in [\hat{\mu}_ {a, t}-\beta_ {a, t}(1-\delta), \hat{\mu}_ {a, t}+\beta_ {a, t}(1-\delta)]$$

The value $\beta_ {a, t}(1-\delta)$, which represents the size of the error and also the size of the confidence interval, indicates how much $\hat{\mu}_ {a, t}$ can be trusted.
The smaller $\beta_ {a, t}(1-\delta)$ is, the more one can think that $\hat{\mu}_ {a, t}$ is "trustworthy," and the larger $\beta_ {a, t}(1-\delta)$ becomes, the more "untrustworthy" $\hat{\mu}_ {a, t}$ becomes.
$\delta$ is the maximum probability that $\mu_ a$ exists outside the confidence interval, known as the probability of failure.
In addition, intuitively one can expect that observing more samples leads to smaller $\beta_ {a, t}(1-\delta)$.
I will write this confidence interval simply as $[L_ {a, t}(\delta), U_ {a, t}(\delta)]$.

&nbsp;&nbsp;&nbsp;&nbsp;
To summarize, for each option $a$, I have constructed a confidence interval $[L_ {a, t}(\delta), U_ {a, t}(\delta)]$ based on the choices and rewards up to time $t$, and theoretically $\mu_ a$ will be inside this interval with probability $1-\delta$ or higher and outside of it with probability less than $\delta$.
Intuitively, the more you choose option $a$, the narrower the interval $[L_ {a, t}(\delta), U_ {a, t}(\delta)]$ gets towards $\mu_ a$, and if you do not choose the option, the interval $[L_ {a, t}(\delta), U_ {a, t}(\delta)]$ will stay the same.

&nbsp;&nbsp;&nbsp;&nbsp;
Assuming that the confidence intervals are somehow calculated, I will show how to utilize them to construct and analyze an algorithm.
How to obtain the confidence intervals may differ by the reward structure, but the idea to utilize them is universal.
I will later show how the intervals are found without proofs.

# The Idea of Upper Confidence Bound

&nbsp;&nbsp;&nbsp;&nbsp;
If all confidence intervals are valid after $t-1$ selections, which means $\mu_ a ∈ [L_ {a, t-1}, U_ {a, t-1}]$ holds for all $a \in A$, one can determine the range of $\mu^\star - \mu_ {a_ t}$, the regret that occurs by choosing $a_ t$ at time $t$.
(I will omit $\delta$ in this section).
Although it is not known which interval includes $\mu^\star$, one can conclude that it is smaller than the maximum of all intervals, i.e., $\max_ {a\in A}U_ {a, t-1}$.
Also choosing $a_ t$ implies $−\mu_ {a_ t} ≤ −L_ {a_ t, t-1}$.
Combining these two facts:

$$
\mu^* - \mu_ {a_ t} \leq \max_ {a\in A}U_ {a, t-1} - L_ {a_ t, t-1}
$$

holds. 
At first glance, it might look like that choosing the option that maximizes $L_ {a_ t, t-1}$ is a good idea because $\max_ {a\in A} U_ {a, t-1}$ is a fixed value.
However, this is not true.
Let's consider a scenario with two options, a left button and a right button, and assume that the left button is slightly better than the other one ($\mu_ 1>\mu_ 2$).
Then consider the case where the right button happened to provide higher reward during the initial selections by coincidence.
Then $L_ {1, t}<L_ {2, t}$ holds and if one keeps pressing the right button, $L_ {2, t}$ will increase toward $\mu_ 2$ while $L_ {1, t}$ stays the same, resulting in choosing the wrong button all the time.

&nbsp;&nbsp;&nbsp;&nbsp;
While $\max_ {a\in A} U_ {a, t-1}-L_ {a_ t, t-1}$ is definitely minimized, it did not lead to a good algorithm.
The reason this algorithm failed is that it was too greedy.
The goal is to reduce the sum $\sum_ {t=K+1}^{T}\max U_ {a, t-1}-L_ {a_ t, t-1}$ over multiple rounds, not just a single value of $\max U_ {a, t-1}-L_ {a_ t, t-1}$.
To achieve this, you need to pay attention to $\max U_ {a, t-1}$ term as well.
While it remains constant for a single selection, there is a way to reduce it for the following rounds.
It is by choosing the option with the highest $U_ {a, t-1}$.
By sampling more from $r(a)$, you gradually decrease $U_ {a, t-1}$, reducing $\sum_ {t=K+1}^{T}\max U_ {a, t-1}-L_ {a_ t, t-1}$ in a farsighted way.

&nbsp;&nbsp;&nbsp;&nbsp;
Now two choices are left.
You can choose the option with the highest $L_ {a, t-1}$ to reduce short-term regret or the option with the highest $U_ {a, t-1}$ to reduce long-term regret.
Mixing these two strategies appropriately seems like a good approach.
Namely, pick the option with the highest $U_ {a, t-1}$ for the initial rounds and then pick the option with the highest $L_ {a, t-1}$ for some final rounds.
In fact, it can be shown that picking the option with the highest $U_ {a, t-1}$ until the end results in a good algorithm.
Let's see what happens to the bound set earlier when choosing the option with the highest $U_ {a, t-1}$.

$$
\begin{aligned}
\mu^* -\mu_ {a_ t} &\leq\max U_ {a, t-1}-L_ {a_ t, t-1} \\
&= U_ {a_ t, t-1} - L_ {a_ t, t-1} \\
&= 2\beta_ {a_ t, t-1}
\end{aligned}
$$

&nbsp;&nbsp;&nbsp;&nbsp;
In other words, choosing the option with the highest $U_ {a, t-1}$ adds at most $2\beta_ {a_ t, t-1}$ to the regret.
Considering that $\beta_ {a, t-1}$ decreases over time if the option $a$ is selected frequently, you might intuitively guess that after a sufficiently long time, choosing the option with the highest $U_ {a, t-1}$ will increase the regret by a very small amount.
In conclusion, if you choose all $K$ options once and then keep choosing the option with the highest $U_ {a, t-1}$ for the remaining $T-K$ chances, the total regret is bounded as the following.

$$
\begin{aligned}
R&\leq K + \sum_ {t=K+1}^{T} 2\beta_ {a_ t, t-1}\\
&=K + \sum_ {t=K+1}^{T} 2\beta_ {a_ t, t-1}(1-\delta)
\end{aligned}
$$

&nbsp;&nbsp;&nbsp;&nbsp;
The algorithm that selects the option with the highest $U_ {a, t-1}$ is generally known as the Upper Confidence Bound algorithm, abbreviated as the UCB algorithm.
Additionally, from the inequality shown above, it is evident that tighter $\beta_ {a_ t, t}(1-\delta)$ leads to smaller theoretical regret bound.

# Getting the Confidence Intervals - Hoeffding's Inequality

&nbsp;&nbsp;&nbsp;&nbsp;
Until this point, I did not use the reward structure, that $r$ is a distribution over $[0, 1]$ for each $K$ arms.
As a result, one can deduce similar conclusions for other kinds of bandit problems, that the sum of confidence intervals' sizes or something equivalent can bound the regret.
Now, the tighter the theoretical confidence intervals of this K-armed bandit I get, the smaller the regret bound becomes.
Actually this is the most complicated part of all these proofs.
In this case, I will use a known theorem to prove the smallest possible regret bound.

> ## Hoeffding's Inequality
>
> Suppose $X_1, X_2, ..., X_n$ are $n$ independent samples of a random variable $X$ that has value in $[a, b]$ and satisfies $\mathbb{E}[X]=0$.
> Let $\bar{X}=\frac{1}{n}\sum_ {i=1}^{n}X_ i$.
> For any $\epsilon>0$,
>
> $$
\begin{aligned}
\mathbb{P}(|\bar{X}|\geq\epsilon)\leq 2\exp\left(-\frac{2n\epsilon^2}{(b-a)^2}\right)
\end{aligned}
> $$
> 
> holds.

&nbsp;&nbsp;&nbsp;&nbsp;
Let's briefly think about what the theorem says: if the value of a random variable is bounded, then the probability of its sample mean differing from its population mean by more than $\epsilon$ decreases exponentially with the number of samples $n$ and exponentially with $\epsilon^2$.

&nbsp;&nbsp;&nbsp;&nbsp;
In our Multi-Armed Bandit problem, b-a equals 1 and defining the probability value on the right-hand side as a single variable $\delta=2\exp\left(-2n\epsilon^2\right)$ gives the following form.

> ## Hoeffding's Inequality for K-armed Bandit
> For a fixed option $a\in A$, if $N_ {a, t}$ samples of $r(a)$ have been observed,
>
> $$
\begin{aligned}
\mathbb{P}\left(|\mu_ {a}-\hat{\mu}_ {a, t}|\geq\sqrt{\frac{\log{\frac{2}{\delta}}}{2N_ {a, t}}}\right)\leq \delta
\end{aligned}
>$$

&nbsp;&nbsp;&nbsp;&nbsp;
In other words, setting $\beta_ {a, t}(1-\delta)=\sqrt{\frac{\log{\frac{2}{\delta}}}{2N_ {a, t}}}$ will lead to $\|\mu_ {a}-\hat{\mu}_ {a, t}\|\leq\beta_ {a, t}(1-\delta)$ with probability at least $1-\delta$.

# Analysis of UCB Algorithm (Upper Confidence Bound Algorithm)

&nbsp;&nbsp;&nbsp;&nbsp;
Now all the necessary blocks are ready, so I will describe the algorithm and prove the regret bound.

>### UCB Algorithm
>
>Take $K, T, \delta$ as inputs.  
>Choose options $1, 2, ..., K$.  
>for $t=K+1, ..., T$, choose the option with the highest $\hat{\mu}_ {a, t-1}+\sqrt{\frac{\log{\frac{2}{\delta}}}{2N_ {a, t-1}}}$ and observe the reward $r_ i$.

&nbsp;&nbsp;&nbsp;&nbsp;
If all confidence intervals are valid, meaning $\mu_ {a, t-1}\in [L_ {a, t-1}(\delta), U_ {a, t-1}(\delta)]$ for all $a\in A$ and $t \in \lbrace 1, 2, ..., T\rbrace$, we have already seen that the regret is bounded as the following.

$$
\begin{aligned}
R&\leq K + \sum_ {t=K+1}^{T} 2\beta_ {a_ t, t-1}(1-\delta)\\
&=K+\sum_ {t=K+1}^{T}\sqrt{\frac{2\log{\frac{2}{\delta}}}{N_ {a_ t, t-1}}}
\end{aligned}
$$

&nbsp;&nbsp;&nbsp;&nbsp;
Now, we only need to show that this value is at most $O\left(\sqrt{KT\log{\frac{1}{\delta}}}\right)$.
I will give an intuitive explanation first before demonstrating a mathematically rigorous proof.
After choosing each option once, if the UCB algorithm selects an option $a$ for the first time at time $t_ 1$, then $N_ {a, t_ 1-1}=1$, and according to the formula above the regret occured by this choice is at most $\sqrt{\frac{2\log{\frac{2}{\delta}}}{1}}$.
Next time the algorithms chooses $a$, $N_ {a, t_ 2-1}$ will equal to 2, and at most $\sqrt{\frac{2\log{\frac{2}{\delta}}}{2}}$ additional regret will occur.
If the option continues to be chosen, the maximum possible regret it causes will decrease as $\sqrt{\frac{2\log{\frac{2}{\delta}}}{3}}, \sqrt{\frac{2\log{\frac{2}{\delta}}}{4}},$ and so on.
Therefore, intuitively, the maximum total regret will be achieved when the $T$ selections are evenly distributed as much as possible among the $K$ options.
Then roughly we expect the following to hold:

$$
\begin{aligned}
\sum_ {t=K+1}^T\sqrt{\frac{2\log{\frac{2}{\delta}}}{N_ {a_ t, t-1}}}&\leq K\sum_ {n=1}^{\frac{T}{K}}\sqrt{\frac{2\log{\frac{2}{\delta}}}{n}}\\
&\leq K\sqrt{2\log{\frac{2}{\delta}}}\left(1+\int_ 1^\frac{T}{K}\frac{1}{\sqrt{x}}dx\right)\\
&\leq K\sqrt{2\log{\frac{2}{\delta}}}\times2\sqrt{\frac{T}{K}}\\
&=2\sqrt{2KT\log{\frac{2}{\delta}}}?
\end{aligned}
$$

The following is a mathematical proof showing that it is the case.
Our guess that the choices should be evenly distributed among the options can be justified by the Cauchy-Schwarz inequality.
The Cauchy-Schwarz inequality is used when going from the thrid line to the fourth.

$$
\begin{aligned}
R&=K+\sum_ {t=K+1}^{T}\sqrt{\frac{2\log{\frac{2}{\delta}}}{N_ {a_ t, t-1}}}\\
&\leq K+\sum_ {a=1}^{K}\sum_ {n=1}^{N_ {a, T}-1} \sqrt{\frac{2\log{\frac{2}{\delta}}}{n}}\\
&\leq K+\sum_ {a=1}^{K}\sqrt{2\log{\frac{2}{\delta}}}\times2\sqrt{N_ {a, T+1}}\\
&\leq K+2\sqrt{\log{\frac{2}{\delta}}}\times\sqrt{2K\sum_ {a=1}^{K}N_ {a, T+1}}\\
&=K+2\sqrt{\log{\frac{2}{\delta}}}\times\sqrt{2K(T-K)}\\
&\leq K+2\sqrt{2KT\log{\frac{2}{\delta}}}
\end{aligned}
$$

&nbsp;&nbsp;&nbsp;&nbsp;
No need to take too much care about math, the most important part is the last line.
Now you know that if you press the buttons in a smart way, you lose less than $O\left(\sqrt{KT\log{\frac{1}{\delta}}} + K\right)$.
However, there is one more concern.
This inequality only holds when "all confidence intervals are valid."
If the probability of this event is low, then the entire inequality becomes useless.

&nbsp;&nbsp;&nbsp;&nbsp;
The probability of a failure of a specific confidence interval is $\delta$, and since there are $TK$ of them, the probability that at least one interval fails is at most $TK\delta$.
This simple principle has a grand name called "union bound" or "Boole's inequality."
Note that these events are not independent, so you cannot simply multiply the probabilities.

&nbsp;&nbsp;&nbsp;&nbsp;
Now we know that the above inequality holds with a probability of $1-TK\delta$. If you want to express the probability that the above inequality holds as $1-\delta$, you should use confidence intervals that hold with probability at least $1-\delta/KT$, which are $[L(\delta/KT), U(\delta/KT)]$.

&nbsp;&nbsp;&nbsp;&nbsp;
As a result, if you replace $\delta$ with $\delta/KT$ as mentioned above, this algorithm satisfies the following regret bound with probability at least $1-\delta$.

$$
\begin{aligned}
R\leq 2\sqrt{2KT\log{\frac{2KT}{\delta}}}+K
\end{aligned}
$$

&nbsp;&nbsp;&nbsp;&nbsp;
If you want to get an algorithm with small expected regret, you can set $\delta=K/T$. Then,

$$
\begin{aligned}
\mathbb{E}[R]&\leq (1-\delta)(K+2\sqrt{2KT\log{\frac{2KT}{\delta}}}) + \delta T\\
&\leq 2\sqrt{2KT\log{2T}}+2K
\end{aligned}
$$

This shows that the expected regret is $O(\sqrt{KT\log{T}}+K)$.
You followed the UCB algorithm with confidence and made a lot of money!

# Conclusion

&nbsp;&nbsp;&nbsp;&nbsp;
Bandit problems and algorithms that solve them are fundamental to reinforcement learning and is actively used in  practical applications such as recommendation systems.
A variant of the UCB algorithm was even used in AlphaGo, the famous AI that defeated human in the game of Go, when choosing where to place the stones.
Although the machine that gives you free money is a fictional story, the challenge of overcoming uncertainty is not only a problem in machine learning, but also what we face all the time in our lives.
I hope that this post has helped you learn about strategies for overcoming uncertainty.

# Reference

[1] Peter Auer. "Using confidence bounds for exploitation-exploration trade-offs." Journal of Machine Learning Research, 3:397–422, 2002.