---
layout: post
title:  "Correct Proof for the UCB Algorithm"
date: 2023-12-26 15:00
category: reinforcement-learning
math: true
---

# Introduction

In the previous [post](/posts/UCB-Algorithm), I introduced the UCB algorithm and proved its $O \left( \sqrt{KT\log\frac{KT}{\delta}} + K \right)$ regret bound.
To achieve it, I utilized confidence intervals that the true mean rewards of the actions lies with high probability.
The final part of the proof involved taking the union bound over $KT$ high-probability confidence intervals, resulting the ${KT}$ term inside the logarithm.

But why $KT$?
One might think the answer is trivial.
There are one confidence interval per one action and one time step, and there are $K$ actions and $T$ time steps, so there are $KT$ intervals.
(Let's ignore the initial $K$ selections for a moment.)
However, out of those $KT$ intervals, there are only $T$ distinct intervals.
Observe that only one interval is updated after a single choice of action.
Hence, if one records all the confidence intervals the algorithm utilizes, only one interval is added per one selection.
Then after $T$ selections, the algorithm would have utilized only $T$ distinct confidence intervals.
Furthermore, there are only $T$ random outcomes, so how can there be $KT$ intervals in the first place?
Does that mean we can take union bound over $T$ intervals and reduce the $\log \frac{KT}{\delta}$ term to $\log \frac{T}{\delta}$?

I found out that most literature does not make it clear or commits error when explaining why union bound over $KT$ intervals must be taken.
I will provide a correct explanation about the union bound under a generalized setting. 
The error hiding behind this example can occur in many situations when dealing with randomness.
I will show how to spot the error and how to deal with it.

Unlike the previous post, this post will be full of mathematical proofs.
The readers are expected to be familiar with probability theory,
although I tried not to use any measure theoretical concepts directly in this post.

# Generalization to SubGaussian Noises

In the previous post I assumed that $r(a)$, the reward distribution for an action $a$, takes values between 0 and 1, and i.i.d. samples of it are observed when the action $a$ is chosen.
This assumption can be much more relaxed.
I will start by defining a subGaussian random variable.

> **Definition** (SubGaussian) A random variable $X$ is $\sigma$-subGaussian if $\mathbb{E}\left[e^{sX}\right] \leq e^{\frac{s^2\sigma^2}{2}}$ holds for all $s\in\mathbb{R}$.

The definition is equivalent to $\forall s\in\mathbb{R}, \mathbb{E}\left[e^{sX-\frac{s^2\sigma^2}{2}}\right] \leq 1$, and in this form I will use more commonly.
As the name suggests, subGaussian random variables are characterized by having smaller tail probabilities than Gaussian random variables.
The standard Gaussian random variable is 1-subGaussian.

There is one property of subGaussian random variables I should mention.

> **Fact** If $X$ is a subGaussian random variable, then $\mathbb{E}\left[ X \right]=0$.

*Proof* : For any $x\in\mathbb{R}$, $1+x \leq e^x$ holds.
Then $1+sX - \frac{s^2\sigma^2}{2} \leq e^{sX - \frac{s^2\sigma^2}{2}}$, and taking the expectation leads to
$1 + s\mathbb{E}\left[ X \right] - \frac{s^2\sigma^2}{2}\leq \mathbb{E} \left[ e^{sX - \frac{s^2\sigma^2}{2}} \right] \leq 1$.
It implies that for any $s\in\mathbb{R}$, $f(s)=s\mathbb{E}\left[ X \right] - \frac{s^2 \sigma^2}{2} \leq 0$.
$f(0)=0$ must be a local maximum, so $f'(0) = \mathbb{E}\left[ X \right] = 0$ must hold. $\square$

From this fact, the subGaussian random variable can be thought as a zero-mean noise with additional constraints.

As we will be working with sequences of random variables, we also need the following definition.

> **Definition** (Conditionally SubGaussian) Let $\lbrace X_ t\rbrace_ {t=1}^\infty$ be a sequence of random variables.
> For $t\geq 1$, $X_ t$ is conditionally $\sigma_ t$-subGaussian if $\mathbb{E}\left[e^{sX_ t}\mid X_ 1, X_ 2, ..., X_ {t-1}\right]\leq e^{\frac{s^2\sigma_ t^2}{2}}$.

Being a sequence of conditionally subGaussian random variables is a generalization of being a sequence of independent subGaussian random variables.
Recall that the conditional expectation $\mathbb{E}\left[e^{sX_ t}\mid X_ 1, X_ 2, ..., X_ {t-1}\right]$ is the expectation of $e^{s X_ t}$ when the values of $X_ 1, X_ 2, ..., X_ {t-1}$ are determined.
The conditional expectation may also be a random variable and or represented as a function of $X_ 1, X_ 2, ..., X_ {t-1}$.
For example, $\mathbb{E}\left[ X_ 1 \mid X_ 1 \right] = X_ 1$, since $X_ 1$ can be thought as a constant once the value of $X_ 1$ is determined.

Let's see some more examples.
Let $X_ 1$ be a random variable that takes values $1$ or $-1$ with probabilities $\frac{1}{2}$ each.
$X_ 1$ is what is usually called a Rademacher random variable.
Suppose $X_ 2$ is sampled from the Gaussian distribution $\mathcal{N}(1, 1)$ when $X_ 1=1$ and from $\mathcal{N}(-1, 1)$ when $X_ 1=-1$.
Although the expectation of $X_ 2$ is $\mathbb{E}\left[ X_ 2 \right]=0$, the conditional expectation is either $1$ or $-1$.
Specifically, $\mathbb{E}\left[ X_ 2 \mid X_ 1 \right]=X_ 1\neq 0$.
Therefore, $X_ 2$ is not conditionally subGaussian.  
Alternatively, suppose $X_ 2$ takes values $1$ or $-1$ with probabilities $\frac{1}{2}$ each when $X_ 1=1$, and $X_ 2 \sim \mathcal{N}(0, 1)$ when $X_ 1 = -1$.
In both cases, $X_ 2$ is 1-subGaussian, meaning that for all $s\in\mathbb{R}$, $\mathbb{E}\left[ e^{sX_ 2} \mid X_ 1 = 1\right]\leq e^{\frac{s^2}{2}}$ and $\mathbb{E}\left[ e^{sX_ 2} \mid X_ 1 = -1\right]\leq e^{\frac{s^2}{2}}$.
The value of $X_ 2$ strongly depends on $X_ 1$, but $X_ 2$ satisfies the property of a subGaussian random variable when conditioned on both possible values of $X_ 1$.
Therefore $X_ 2$ is conditionally subGaussian.

We will be working under the following problem setting.
Instead of i.i.d. rewards between 0 and 1, the rewards will be given with conditionally subGaussian noises.

> The action set $\mathcal{A} = \lbrace 1, 2, ..., K \rbrace$ is given.  
> Each action's mean reward $\mu_ a^* \in \left[ 0, 1 \right] (a\in\mathcal{A})$ is an unknown constant.  
> For $t = 1, 2, ..., T$, the agent chooses an action $a_ t\in\mathcal{A}$, and observes $r_ t = \mu_ {a_ t}+ X_ t$ as a reward,
> where $X_ t$ is a conditionally $\sigma$-subGaussian random variable when conditioned on $a_ 1, X_ 1, ..., a_ {t-1}, X_ {t-1}, a_ t$.

Specifically, $\forall s\in \mathbb{R}, \mathbb{E}\left[e^{sX_ t}\mid a_ 1, X_ 1, ..., a_ {t-1}, X_ {t-1}, a_ t \right]\leq e^{\frac{s^2\sigma^2}{2}}$ must hold.
Note that $X_ t$ may depend on all the previously selected actions and observed rewards, including the $t$-th action.
Also note that the mean rewards $\mu_ a^*$ are bounded, but the observed rewards $r_ t$ may be unbounded.

Recall that the UCB algorithm chooses the action with the highest $\hat{\mu}_ {a, t-1} + \beta_ {a, t-1}$.
Here, $\hat{\mu}_ {a, t-1}$ is the empirical mean of rewards obtained by choosing the action $a$ until time $t-1$,
and $\beta_ {a, t-1}$ is the appropriate size of the confidence interval so that $|\mu_a^* - \hat{\mu}_ {a, t-1}|\leq \beta_ {a, t-1}$ holds with high probability.
In the previous post, I had shown that such selection incurs at most $2 \beta_ {a, t-1}$ regret at time $t$, as long as all the confidence intervals are valid, i.e. $|\mu_a^* - \hat{\mu}_ {a, t-1}|\leq \beta_ {a, t-1}$ holds for all $a\in\mathcal{A}$.
Suppose that until time $t$, an action $a$ was chosen at time $t_ {a, 1}, t_ {a, 2}, ..., t_ {a, N_ {a, t}}$, where $N_ {a, t}$ is the number of times the action was chosen until time $t$.
The difference between the empirical mean and the true mean is

$$
\left| \hat{\mu}_ {a, t} - \mu_ a^* \right| = \left| \frac{1}{N_ {a, t}}\sum_{i=1}^{N_ {a, t}} X_ {t_ {a, i}} \right|.
$$

Therefore, we need a high probability bound for the mean or the sum of conditionally subGaussian random variables.
The UCB algorithm transforms the Multi-Armed Bandit problem into a problem of constructing a high-probability confidence interval.
If the values of $\beta_ {a, t}$ are appropriately chosen so that $\left| \frac{1}{N_ {a, t}}\sum_{i=1}^{N_ {a, t}} X_ {t_{a, i}} \right| \leq \beta_ {a, t}$ hold for all $a$ and $t$ with probability at least $1 - \delta$, then the regret of the UCB algorithm is at most $K + \sum_ {t = K+1}^T 2\beta_ {a, t-1}$ with the same probability.
Therefore, the smaller the $\beta_ {a, t}$s are, the smaller regret we get.
From now on, I will focus on obtaining the high probability bound for the sum of subGaussian random variables.

*Side-Note 1* The following lemma shows why having subGaussian noises is a generalization of having bounded rewards, whose proof I omit.

> **Lemma** (Hoeffding's lemma) If a random variable $X$ satisfies $\mathbb{E}\left[X\right]=0$ and $a\leq X\leq b$ almost surely for some $a, b\in\mathbb{R}$, then $X$ is $\frac{b-a}{2}$-subGaussian.

# Markov's Inequality and Azuma's Inequality

Markov inequality is one of the most basic probability inequalities.

> **Theorem** (Markov's inequality) If $X$ is a nonnegative random variable, then for any $c\geq0$,
> 
> $$
c\mathbb{P}\left[X\geq c\right]\leq \mathbb{E}\left[X\right].
> $$

*Proof* : Take the expectations on the both sides of the inequality $c\mathbf{1}\left(X\geq c\right)\leq X$, where $\mathbf{1}$ is the indicator function. $\square$

Combining the definition of subGaussian and Markov inequality leads to a high probability concentration inequality for subGaussian random variables.

> **Theorem** (Concentraion inequality for subGaussian random variables) Suppose $X$ is a $\sigma$-subGaussian random variable.
> Then $\mathbb{P}\left[| X | \geq \sigma\sqrt{2\log \frac{2}{\delta}} \right] \leq \delta$ for any $0<\delta\leq 1$.

*Proof* : By definition, $\mathbb{E} \left[ e^{sX} \right] \leq e^{\frac{s^2 \sigma^2}{2}}$, or equivalently, $\mathbb{E}\left[ e^{sX - \frac{s^2\sigma^2}{2} } \right]\leq 1$ for all $s\in\mathbb{R}$.
Apply Markov inequality with $c = \frac{1}{\delta}$ and get $\mathbb{E} \left[ e^{sX - \frac{s^2\sigma^2}{2} } \geq \frac{1}{\delta} \right] \leq \delta$.
Assume $s>0$.
Taking logarithms and rearranging the terms yields

$$
\mathbb{E}\left[ X \geq \frac{s\sigma^2}{2} + \frac{1}{s}\log{\frac{1}{\delta}} \right]\leq \delta.
$$

To minimize $\frac{s\sigma^2}{2} + \frac{1}{s}\log{\frac{1}{\delta}}$, take $s = \frac{1}{\sigma}\sqrt{2\log\frac{1}{\delta}}$ (recall the AM-GM inequality).
We obtain

$$
\mathbb{E}\left[ X \geq \sigma \sqrt{2 \log \frac{1}{\delta}} \right]\leq \delta.
$$

Following the same process for $-X$ gives

$$
\mathbb{E}\left[ X \leq - \sigma \sqrt{2 \log \frac{1}{\delta}} \right]\leq \delta.
$$

Take union bound over the previous two inequalities to get the desired result.

$$
\mathbb{E}\left[ | X | \geq \sigma \sqrt{2 \log \frac{2}{\delta}} \right]\leq \delta
$$

$\square$

The generailized Azuma's inequality shows a high probability bound for a sum of subGaussian random variables.

> **Theorem** (Generalized Azuma's inequality) Let $X_ 1, X_ 2, ..., X_ n$ be a finite sequence of random variables.
Assume that $X_ t$ is conditionally $\sigma_ t$-subGaussian.
Then for any $0<\delta\leq1$,
>
>$$
\mathbb{P}\left[\left|\sum_ {t=1}^nX_ t\right|\geq\sqrt{2 \left( \sum_ {t=1}^n \sigma_ t^2 \right)\log{\frac{2}{\delta}}}\right]\leq \delta.
>$$
>
> Particularly, if $\sigma_ 1 = \sigma_ 2 = \cdots = \sigma_ n = \sigma$, then
> 
>$$
\mathbb{P}\left[\left|\sum_ {t=1}^nX_ t\right|\geq\sigma\sqrt{2n\log{\frac{2}{\delta}}}\right]\leq \delta.
>$$

*Proof* : The proof is basically showing the sum $\sum_ {t=1}^n X_ t$ is a $\sqrt{ \sum_ {t=1}^n \sigma_ t^2 }$-subGaussian random variable, and apply the concentration inequality for subGaussian random variables.  
Fix $s\in\mathbb{R}$.
Let $D_ t = \exp\left(sX_ t-\frac{s^2\sigma_ t^2}{2}\right)$.
Then $0<\mathbb{E}\left[D_ t\mid X_ 1, X_ 2, ..., X_ {t-1}\right]\leq 1$ since $X_ t$ is conditionally $\sigma_ t$-subGaussian.
Let $M_ t$ be the product $D_ 1D_ 2...D_ t = \exp\left(s\sum_ {i=1}^t X_ i - \frac{s^2}{2} \sum_ {i=1}^t \sigma_ i^2\right)$, where I define $M_ 0=1$.
Then $M_ t = M_ {t-1}D_ t$, and since the value of $M_ {t-1}$ is fixed once the values of $X_ 1, X_ 2, ..., X_ {t-1}$ are determined,

$$
\begin{aligned}
\mathbb{E}\left[M_ t\mid X_ 1, X_ 2, ..., X_ {t-1}\right] 
=& \mathbb{E}\left[M_ {t-1}D_ t\mid X_ 1, X_ 2, ..., X_ {t-1}\right]\\
=& M_ {t-1}\mathbb{E}\left[D_ t \mid X_ 1, X_ 2, ..., X_ {t-1}\right]\\
\leq& M_ {t-1}.
\end{aligned}
$$

By the law of iterated expectation,

$$
\begin{aligned}
\mathbb{E}\left[M_ n\right]
=&\mathbb{E}\left[\mathbb{E}\left[M_ n\mid X_ 1, X_ 2, ..., X_ {n-1} \right]\right]\\
\leq& \mathbb{E}\left[M_ {n-1}\right] \\
=& \mathbb{E}\left[\mathbb{E}\left[M_ {n-1}\mid X_ 1, X_ 2, ..., X_ {n-2} \right]\right]\\
\leq& \cdots \\
\leq& \mathbb{E}\left[ M_ 0 \right]\\
=&1.
\end{aligned}
$$

which means that $\mathbb{E}\left[ \exp \left(s \left(\sum_ {t=1}^n X_t \right) - \frac{s^2}{2} \left( \sum_ {t=1}^n \sigma_ t^2 \right) \right) \right] \leq 1$.
Therefore, $\sum_ {t=1}^nX_ t$ is $\sqrt{ \sum_ {t=1}^n \sigma_ t^2 }$-subGaussian.
Apply the concentration inequality to $\sum_ {t=1}^nX_ t$.

$$
\mathbb{P}\left[ \left| \sum_ {t=1}^n X_ t \right| \geq \sqrt{2 \left( \sum_ {t=1}^n \sigma_ t^2 \right) \log \frac{2}{\delta}}\right]
$$

$\square$

Note that $n$ and $\sigma_t^2$ are fixed values.

Recall that $X_ {t_ {a, i}}$ is the noise added to the observed reward when the action $a$ is selected for the $i$-th time.
By the Azuma inequality, the following concentration inequalities holds for all $a\in\mathcal{A}$.

$$
\begin{gather*}
    \mathbb{P}\left[ \left|\sum_ {i=1}^{1}X_ {t_ {a, i}}\right|\leq\sigma\sqrt{2\log{\frac{2}{\delta}}} \right] \leq \delta \\
    \mathbb{P}\left[ \left|\sum_ {i=1}^{2}X_ {t_ {a, i}}\right|\leq\sigma\sqrt{4\log{\frac{2}{\delta}}} \right] \leq \delta \\
    \vdots \\
    \mathbb{P}\left[ \left|\sum_ {i=1}^{N_{a, T}}X_ {t_ {a, i}}\right|\leq\sigma\sqrt{2N_{a, T}\log{\frac{2}{\delta}}} \right] \leq \delta
\end{gather*}
$$

Set $\beta_ {a, t}(1-\delta) = \sqrt{\frac{2}{N_ {a, t}}\log \frac{2}{\delta}}$.
There are $N_ {a, T}$ inequalites for each $a$, and $\sum_ {a=1}^K N_ {a, T} = T$.
Therefore, there are $T$ concentration inequalities that must hold in total.
Replace $\delta$ with $\frac{\delta}{T}$ and take union bound over the $T$ events.
Then the probability of any of the inequality not being valid will be less than $\delta$.
Does that mean working with $\beta_ {a, t}(1 - \frac{\delta}{T}) = \sqrt{\frac{2}{N_ {a, t}}\log \frac{2T}{\delta}}$ sufficient?
Well... $N_ {a, T}$ is a random variable that depends on $X_ 1, X_ 2, ..., X_ {T-1}$, so can we?
No.

# Paradox about Maximum of 100 Gaussian Random Variables

Finding the error in the previous claim may be tricky, so I came up with a similiar example whose error is more evident.

The probability of a standard Gaussian random variable exceeding $2$ is approximately 2.3%.
Suppose $X_ 1, X_ 2, ..., X_ {100}$ are one hundred i.i.d. samples from the standard Gaussian distribution.
Roughly, about two of them would exceed $2$.
Suppose $X_ 7$ attains the maximum value among the hundred samples.
Its value is very likely to exceed $2$.
Specifically, the probability of the maximum value among the hundred samples not exceeding $2$ is $(0.977)^{100} \approx 0.10$, or 10%, because it is equivalent to the probability of all the samples not exceeding $2$.
Then the probability of $X_ 7$ exceeding $2$ is 90%.
However, $X_ 7$ follows the standard Gaussian distribution, so its probability of exceeding $2$ must be 2.3%!
How can a probability be 90% and 2.3% at the same time?

It is clear that there is an error, and probably most people would be able to sense it even if they cannot explain it clearly.
The catch is that the sample of interest, which is the sample that attained the maximum value, depends on the random outcomes.
$X_ 7$ is chosen because it took a larger value than average.
If one inspects the value of $X_ 7$ independently of the outcomes of the hundred samples, it will follow the standard Gaussian distribution.
Surely, for any fixed $k$ between $1$ and $100$, $X_ k$ follows the distribution of the standard Gaussian.
However, this example shows that if $k$ is also a random variable that depends on the values of $X_ 1, X_ 2, ..., X_ {100}$, for instance if $k = \text{argmax}_ {i} X_ i$, then $X_ k$ may not follow the standard Gaussian distribution anymore.

# Counterexample for the Azuma's Inequality with Random Length

I will provide a specific counterexample of the Azuma's inequality with random length.
Let $\lbrace Z_ t \rbrace_ {t=1}^T$ be a sequence of independent standard Gaussian random variables.
Each $Z_ t$ is 1-subGaussian.
Take any $0<\delta<1$.
Let $N$ be a random variable that takes on natural numbers.
The question is : will the following inequality hold for random $N$?

$$  
    \mathbb{P}\left[ \left| \sum_ {i=1}^N Z_ i \right| \geq \sqrt{2N\log\frac{2}{\delta}} \right] \leq \delta
$$

Wrong claim : Yes. Once $N$ is sampled, for example say $N=10$, then $\mathbb{P}\left[ \left| \sum_ {i=1}^{10} Z_ i \right| \geq \sqrt{20\log\frac{2}{\delta}} \right] \leq \delta$ should hold by the Azuma inequality.
This should hold regardless of the value of $N$, so the inequality must hold.

With the previous paradox in mind, you will be able to find the flaw in the logic.
It makes sense if $N$ is a fixed value, or if $N$ is independent of $\lbrace Z_ t \rbrace_ {t=1}^T$.
It can be proved as the following.

$$
\begin{aligned}
    \mathbb{P}\left[ \left| \sum_ {i=1}^N Z_ i \right| \geq \sqrt{2N\log\frac{2}{\delta}} \right]
    =& \sum_ {n=1}^T \mathbb{P}\left[ \left| \sum_ {i=1}^N Z_ i \right| \geq \sqrt{2N\log\frac{2}{\delta}} , N=n\right] \\
    =& \sum_ {n=1}^T \mathbb{P}\left[ \left| \sum_ {i=1}^n Z_ i \right| \geq \sqrt{2n\log\frac{2}{\delta}} , N=n\right] \\
    =& \sum_ {n=1}^T \mathbb{P}\left[ \left| \sum_ {i=1}^n Z_ i \right| \geq \sqrt{2n\log\frac{2}{\delta}} \right] \mathbb{P}\left[ N=n\right] \\
    \leq& \sum_ {n=1}^T \delta \mathbb{P}\left[ N = n \right]\\
    =& \delta
\end{aligned}
$$

where the independence of $N$ and $Z_ i$ is used at the third equality.
However, if $N$ is dependent on $Z_ i$, then the probability may not be bounded by $\delta$.

Finding a concrete counterexample is a little bit tricky.
Based on the previous example that chose $k = \text{argmax}_ {i} X_ i$ to amplify the probability of $X_ k > 2$, we will consider the following choice of $N$.

$$
N = \min \left(\left\lbrace t : \left| \sum_ {i=1}^t Z_ i \right| \geq \sqrt{2t\log \frac{2}{\delta}}\right\rbrace \cup \lbrace T \rbrace \right)
$$

$N$ is the first $t$ that $\left| \sum_ {i=1}^t Z_ i \right| \geq \sqrt{2t\log \frac{2}{\delta}}$ happens, or $N=T$ if such event never happens.
$N$ is what is called the "stopping time".
One observes the values of $Z_ t$ one by one, and then "stops" when certain condition is met.
In this way, $\left| \sum_ {i=1}^N Z_ i \right| < \sqrt{2N\log\frac{2}{\delta}}$ can happen only if $N = T$, since otherwise the sequence would not have "stopped" at $t=N$.
Then we need to investigate the probability of $N = T$ and $N < T$.
If we prove that $\mathbb{P}\left[ N < T \right] > \delta$ holds for big enough $T$, then we are done since

$$
\begin{aligned}
    \mathbb{P}\left[ \left| \sum_ {i=1}^{N} Z_ i \right| \geq \sqrt{2N\log\frac{2}{\delta}} \right] \geq \mathbb{P}\left[ N < T \right] .
\end{aligned}
$$

Let $t_ j = 2^j$ for $j=0, 1, ...$.
Partition the set of natural numbers as $I_ j = \lbrace t_ j, t_ j+1, t_ j+2, ..., t_ {j+1}-1\rbrace$ so that

$$
\begin{aligned}
    I_ 0 =& \lbrace 1 \rbrace \\
    I_ 1 =& \lbrace 2, 3 \rbrace \\
    I_ 2 =& \lbrace 4, 5, 6, 7 \rbrace \\
    \vdots
\end{aligned}
$$

and so on.
Let $\gamma = \mathbb{P}\left[ Z \geq 2\sqrt{ \log \frac{2}{\delta} } \right]$ when $Z \sim \mathcal{N}(0, 1)$.
I will focus on the probability that the concentration inequality is violated at time $t_ {j+1} -1$ for $j = 0, 1, ...$.
Let $B_ j = \sum_ {t = t_ j}^{t = t_ {j+1} -1} Z_ t$, the sum of $Z_ t$ for $t\in I_ j$.
Then $B_ j \sim \mathcal{N}(0, t_ j)$.
It implies that $\mathbb{P}\left[ B_ j \geq 2\sqrt{ t_ j \log \frac{2}{\delta}} \right]= \gamma$ and $\mathbb{P}\left[ B_ j \leq -2 \sqrt{t_ j \log \frac{2}{\delta}} \right]= \gamma$.
Then,

$$
\begin{aligned}
    \mathbb{P}\left[ \left| \sum_ {t=1}^{t_ {j+1} -1} Z_ t \right| \geq \sqrt{2 (t_ {j+1} -1)\log \frac{2}{\delta}}\right]
    \geq& \mathbb{P}\left[ \left| \sum_ {t=1}^{t_ {j+1} -1} Z_ t \right| \geq 2 \sqrt{t_ {j} \log \frac{2}{\delta}}\right]\\
    \geq& \mathbb{P}\left[  \sum_ {t=1}^{t_ {j}} Z_ t \geq 0, B_ j \geq 2 \sqrt{t_ {j} \log \frac{2}{\delta}} \right]\\
    &+\mathbb{P}\left[ \sum_ {t=1}^{t_ {j}} Z_ t  \leq 0, B_ j \leq -2 \sqrt{t_ {j} \log \frac{2}{\delta}} \right]\\
    =& \frac{1}{2} \cdot \gamma + \frac{1}{2} \cdot \gamma\\
    =& \gamma
\end{aligned}
$$

It implies that the concentration inequality is violated at every $t = 2^j - 1$ with probability at least $\gamma$, indepedently of previous events.
It gives a probability bound for $N$.

$$
\begin{aligned}
    \mathbb{P}\left[ N \geq 2^j \right] \leq (1-\gamma)^{j-1}
\end{aligned}
$$

For big enough $J$, $(1 - \gamma)^{J-1} < 1 - \delta$ holds.
Then $\mathbb{P}\left[ N < 2^J \right] > \delta$.
If $T > 2^J$, then $\mathbb{P}\left[ N < T\right] >  \delta$ which implies that

$$
\mathbb{P}\left[ \left| \sum_ {t=1}^{N} Z_ t\right| \geq \sqrt{2N \log \frac{2}{\delta}} \right] > \delta.
$$

We have proved that the Azuma inequality does not hold for the random length $N$.

*Side-Note 2*  It is possible to prove that the probability can become arbitrarily close to 1.
Furthermore, the number of times $\left| \sum_ {t=1}^n Z_ t \right| \geq \sqrt{2n \log \frac{2}{\delta}}$ occurs goes to infinity almost surely as $T\rightarrow\infty$.

*Side-Note 3*  This counterexample is motivated by the proof for the lower bound of the law of iterated logarithm.[1]

The counterexample also applies for random $\sigma_t$.
Take $Z_ t' = Z_ t \mathbf{1}(t \leq N)$.
Then $Z_ t'$ is either 1-subGaussian or 0-subGaussian depending on $N$.
However, as we have just checked, the following inequality does not hold for big enough $T$.

$$
\begin{aligned}
    \mathbb{P}\left[ \left| \sum_ {i=1}^T Z_ i' \right| \geq \sqrt{2 \left(\sum_ {i=1}^T \sigma_i^2 \right)\log\frac{2}{\delta}} \right]
    =& \mathbb{P}\left[ \left| \sum_ {i=1}^T Z_ i' \right| \geq \sqrt{2 N\log\frac{2}{\delta}} \right]\\
    \nleq& \delta
\end{aligned}
$$

*Side-Note 4* The partition $I_ 0, I_ 1, ...$ will reappear in the next post when constructing a tighter concentration inequality.

# Verifying the $KT$ Union Bound

We have seen that dealing with random length may be tricky.
One simple solution is to take union bound over all the possible lengths.
Since $N$ can have at most $T$ distinct values, one can take union bound over $T$ events and get

$$
\begin{aligned}
    \mathbb{P}\left[ \left| \sum_ {i=1}^{N} Z_ i \right| \geq \sqrt{2N\log\frac{2T}{\delta}} \right]
    =& \sum_ {n=1}^T \mathbb{P}\left[ \left| \sum_ {i=1}^{N} Z_ i \right| \geq \sqrt{2N\log\frac{2T}{\delta}} , N = n\right] \\
    =& \sum_ {n=1}^T \mathbb{P}\left[ \left| \sum_ {i=1}^n Z_ i \right| \geq \sqrt{2n\log\frac{2T}{\delta}} , N = n\right] \\
    \leq& \sum_ {n=1}^T \mathbb{P}\left[ \left| \sum_ {i=1}^n Z_ i \right| \geq \sqrt{2n\log\frac{2T}{\delta}}\right] \\
    \leq& \sum_ {n=1}^T \frac{\delta}{T}\\
    =& \delta.
\end{aligned}
$$

You might find choosing $N$ in such a way, basically "stopping" when the bound does not hold, like cheating.
However, similar situations occur in bandit problems.
If observed rewards from an action were unluckily much lower than its expectation, then the algorithm is more likely to "stop" choosing that action.
As I have already shown, the algorithm encounters only $T$ distinct confidence intervals.
However, the confidence intervals that must hold are random and strongly depends on the outcomes of $X_ 1, X_ 2, ..., X_T$.
Specifically, the number of confidence intervals that must hold for an action is $N_ {a, T}$, which is a random variable that depends on $X_ 1, X_ 2, ..., X_T$.
We now know that we cannot take union bound over $T$ events.

Then what should we do?
Take union bound over a deterministic set of events that includes all the confidence intervals we may need.
To define such intervals, we need to define some additional random variables.

For $a\in A$ and $1\leq k \leq T$, let $Y_ {a, k}$ be $X_ {t_ {a, k}}$, the noise at the $k$-th selection of $a$, if $k\leq N_ {a, T}$, or 0 otherwise.

$$
Y_ {a, k}=\begin{cases}
X_ {t_ {a, k}} & (k\leq N_ {a, T})\\
0 & (k>N_ {a, T})
\end{cases}
$$

$Y_ {a, k}$ is a well-defined random variable. 
Also, it is natural that $\left\lbrace Y_ {a, k} \right\rbrace_ {k=1}^T$ is conditionally $\sigma$-subGaussian for a fixed $a\in\mathcal{A}$.
I will not prove this fact since it is quite long to write down all the details compared to how trivial it seems intuitively.
The basic idea for the proof is that a subsequence of conditionally subGaussian random variables and zeros are also conditionally subGaussian, when the original sequence is subGaussian even when conditioned on $a_t = a$.

For each $a$, we want the following inequalities to hold.

$$
\begin{gather}
    \mathbb{P}\left[ \left| \sum_{k=1}^1 Y_ {a, k} \right| \geq \sigma\sqrt{2 \log \frac{2}{\delta}} \right] \leq \delta\\
    \mathbb{P}\left[ \left| \sum_{k=1}^2 Y_ {a, k} \right| \geq \sigma\sqrt{4 \log \frac{2}{\delta}} \right] \leq \delta\\
    \vdots \\
    \mathbb{P}\left[ \left| \sum_{k=1}^T Y_ {a, k} \right| \geq \sigma\sqrt{2T \log \frac{2}{\delta}} \right] \leq \delta
\end{gather}
$$

For any $N_ {a, T}$, all the confidence intervals are valid with probabilities $1-\delta$ each.
Now, there are $KT$ inequalities that must hold, so take the union bound over the $KT$ events.
We are taking union bound over events that may not be required to hold in one possible sequence of outcomes, but could be required in some other possibilities.
This is why the union bound over $KT$ events must be taken.

# Conclusion

In this post, I explained why the union bound over $KT$ events is necessary.
The question originated from a proof for the regret bound of the UCB algorithm I read.
The proof led me to think that the $\log {KT}$ term could be improved to $\log{T}$.
After some studying, I realized that the original proof was wrong.

In the next post, I will show that by taking the union bound in a more efficient way, $O\left( \sqrt{KT \log \frac{K(\log T)}{\delta}} + K \right)$ regret is achievable using tighter time-uniform bounds for the sum of subGaussian random variables.
I find it quite interesting, and many ideas introduced in this post will be used.

The paradox I introduced can appear in both academic works and the real world.
For instance, suppose you came across news reporting a thousand lottery winners last week, which is an unusually high number, and you knew that the odds are one out of a million.
Would you conclude that about a billion tickets were sold? 
It is possible that the number of tickets sold was unusually high too, resulting the increase of the winners.
However, you were informed about the number of winners "because" it was an unusual occurrence.
You cannot assume it represents average behavior, analogously to the case of the maximum of Gaussian random variables.
I hope this post has helped you in overcoming such probabilistic fallacies.

# Reference

[1] Rick Durrett, "Probability: Theory and Examples", 2019.