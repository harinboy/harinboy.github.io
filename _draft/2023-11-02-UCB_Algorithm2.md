---
layout: post
title:  "Simple and Correct Proof for General, Tighter, and Time-uniform Bounds for UCB Algorithm"
date: 2023-11-02 21:00
category: reinforcement-learning
math: true
---

TODO  
Show that $Y_{a, k}$ is $\sigma^2$-subGaussian.  
Give a simple counter example of wrong Azuma inequality.

# Introduction

In the previous [post](/_posts/2023-10-31-UCB-Algorithm.md) I introduced and proved the regret bound of the UCB algorithm.
The final part of the proof was taking union bound over $TK$ intervals.
However, only one confidence interval is updated after each action seletion, so there are only $T$ confidence intervals that the bound must hold.
I found out that many sources, including my last post, do not make it clear, or even commit error, when explaining why one should take union bound over $TK$ intervals.
In this post I will go deeper and provide a general and correct proof of the bounds used in the UCB algorithm.
Then I will provide a tighter bound.
Unlike the previous post, this post will be full of mathematical proofs, and also the readers are expected to have some advanced knowledge about probability theory based on the measure theory.
This is **not** an introductory explanation like the last one.

# Preview of the Main Question

After obtaining confidence bounds of the form $\left[\hat{\mu}_{a, t}-\beta_{a, t}(1-\delta), \hat{\mu}_{a, t}+\beta_{a, t}(1-\delta)\right]$ that is violated with probability less than $\delta$, I had taken the union bound over $TK$ bounds.
This may look correct since there are $K$ intervals per $T$ time steps.
However, out of such $TK$ intervals, most of them overlap.
Specifically, if an action $a$ is chosen at time $t_1$ and $t_2$, then the interval $\left[\hat{\mu}_{a, t}-\beta_{a, t}(1-\delta), \hat{\mu}_{a, t}+\beta_{a, t}(1-\delta)\right]$ stays the same for $t_1\leq t <t_2$, so there are only one interval that needs to hold for such $t$.
Observe that only one interval is updated after one selection, of course the interval corresponds to the chosen action, so there are only $T-1$ intervals that has to be valid for the proof of regret bound of the UCB algorithm to hold.
Then can we take union bound over $T$ intervals?
The answer is "No".
But why?
I was surprised that many literatures fail to provide the correct reason.
Some claim erroneous version of Azuma inequality to justify it.
Others address the problem correctly, but usually it is left as an exercise.
In this post I will delve deeper, and show that using the idea obtained while explaining why one should take union bound over $TK$ intervals.

# Generalization to subGaussian noise

In the previous post I assumed that $r(a)$, the reward distribution for an action $a$, has value between 0 and 1, and i.i.d. samples are observed when the action $a$ is chosen.
This assumption can be much more generalized to the concept of subGaussian noise.

> **Definition** (SubGaussian) A random variable $X$ is called $\sigma^2$-subGaussian if $\mathbb{E}\left[X\right]=0$ and $\mathbb{E}\left[e^{sX}\right] \leq e^{\frac{s^2\sigma^2}{2}}$ for all $s\in\mathbb{R}$.

As the name suggests, subGaussian random variables are characterized by having smaller tail probability than a Gaussian random variable.

As we wil work with a sequence of random variables, I need the following definition the be more general.

> **Definition** (Conditionally SubGaussian) Let $X_1, X_2, ..., $ be a sequence of random variable and $\left\{\mathcal{F}_t\right\}_{t=0}^\infty$ is a filtration such that $X_t$ is $\mathcal{F}_{t}$-measurable.
> For $t\geq 1$, $X_t$ is conditionally $\sigma_t^2$-subGaussian if $\mathbb{E}\left[X_t\mid\mathcal{F}_{t-1}\right]=0$ and $\mathbb{E}\left[e^{sX_t}\mid\mathcal{F}_{t-1}\right]\leq e^{\frac{s^2\sigma_t^2}{2}}$.

Being a sequence of a conditionally subGaussian random variables is a generalization of being a sequence of independent subGaussian random variables.
Note that the distribution of $X_t$ may change depending on $X_1, X_2, ..., X_{t-1}$, but its mean and tail probability should satisfy the property of a subGaussian random variable.

Instead of i.i.d. reward between 0 and 1, the reward will be given as the following:

If an action $a$ is selected at time $t$, $\mu_{a}+X_t$ is given as a reward, where $\mu_a\in\mathbb{R}(a\in A)$ is an unknown fixed mean reward for each action and $X_t$ is a conditionally $\sigma^2$-subGaussian random variable.

Note that $X_t$ may depend on all the previous action selections and observed rewards, but it must still satisfy the property of $\sigma^2$-subGaussian at the point of being sampled, hence "conditionally" $\sigma^2$-subGaussian.
Specifically, if $\mathcal{F}_t^-=\sigma(a_1, X_1, ..., a_{t-1}, X_{t-1}, a_t)$ is the sigma algebra defined by selected actions until time $t$ and rewards until time $t-1$, $\mathbb{E}\left[X_t\mid\mathcal{F}_t^-\right]=0$ and $\mathbb{E}\left[e^{sX_t}\mid\mathcal{F}_t^-\right]\leq e^{\frac{s^2\sigma^2}{2}}$ must hold.

The following lemma shows why this is a generalization of bounded reward setting.

> **Lemma** (Hoeffding's lemma) If a random variable $X$ satisfies $\mathbb{E}\left[X\right]=0$ and $a\leq X\leq b$ almost surely for some $a, b\in\mathbb{R}$, then $X$ is $\frac{b-a}{2}$-subGaussian.

As I will not use this lemma and the proof is quite complicated, I omit the proof of this lemma.

# Markov's inequality and Azuma's inequality

Markov inequality is one of the most basic probability inequality.

>**Theorem** (Markov's inequality) If $X$ is a nonnegative random variable, then for any $a\geq0$,
$$
a\mathbb{P}\left[X\geq a\right]\leq \mathbb{E}\left[X\right]
$$
*Proof* : Take the expectation of the both sides of the inequality $a\mathbf{1}\left(X\geq a\right)\leq X$, where $\mathbf{1}$ is the indicator function. $\square$

Combining the definition of subGaussian and Markov inequality gives a high probability bound for a subGaussian random variable.

> **Theorem** If $X$ is a $\sigma^2$-subGaussian random variable, then for any $0<\delta\leq1$, the three inequalities hold:
> $$
> \mathbb{P}\left[X\geq\sigma\sqrt{2\log{\frac{1}{\delta}}}\right]\leq \delta\\
> \mathbb{P}\left[X\leq-\sigma\sqrt{2\log{\frac{1}{\delta}}} \right]\leq \delta\\
> \mathbb{P}\left[|X|\geq \sigma\sqrt{2\log{\frac{2}{\delta}}}\right]\leq \delta
> $$
*Proof* : The second inequality follows from the first by replacing $X$ with $-X$.
The third inequality follows from taking union bound over the first two inequalities.
I only need to prove the first inequality.  
By definition, $\mathbb{E}\left[e^{sX}\right]\leq e^{\frac{s^2\sigma^2}{2}}$, or equivalently, $\mathbb{E}\left[e^{sX-\frac{s^2\sigma^2}{2}}\right]\leq 1$.
Applying Markov inequality with $a=\frac{1}{\delta}$ gives $\mathbb{P}\left[e^{sX-\frac{s^2\sigma^2}{2}}\geq\frac{1}{\delta}\right]\leq\delta$.
Let $s>0$ and rearranging the terms gives
$$
\mathbb{P}\left[X\geq\frac{s\sigma^2}{2}+\frac{1}{s}\log{\frac{1}{\delta}}\right]\leq\delta
$$
Take $s=\frac{1}{\sigma}\sqrt{2\log{\frac{1}{\delta}}}$ to minimize the righthand side and get
$$
\mathbb{P}\left[X\geq\sigma\sqrt{2\log{\frac{1}{\delta}}}\right]\leq\delta
$$
$\square$

Generailized Azuma's inequality gives a high probability bound for a sum of random variables. One might notice that combining Hoeffding's lemma and this inequality gives the Hoeffding's inequality.

>**Theorem** (Generalized Azuma's inequality) Let $X_1, X_2, ..., X_n$ be a finite sequence of conditionally $\sigma^2$-subGaussian random variables. Then for any $0<\delta\leq1$,
>$$
\mathbb{P}\left[\left|\sum_{t=1}^nX_t\right|\geq\sigma\sqrt{2n\log{\frac{2}{\delta}}}\right]\leq \delta
>$$

*Proof* : The proof is basically showing that the sum $\sum_{t=1}^n X_t$ is a $\sigma^2t$-subGaussian random variable.
Let $\left\{\mathcal{F}_t\right\}_{t=0}^n$ be the filtration generated by $X_1, X_2, ..., X_n$.
Fix any $s\in\mathbb{R}$.
Let $D_t = \exp\left(sX_t-\frac{s^2\sigma^2}{2}\right)$ so that $0<\mathbb{E}\left[D_t\mid\mathcal{F}_{t-1}\right]\leq 1$.
Let $M_t$ be the product $D_1D_2...D_t = \exp\left(s\sum_{i=1}^t X_i - \frac{s^2\sigma^2t}{2}\right)$, where we define $M_0=1$ for convinience.
Then $M_t = M_{t-1}D_t$ and $M_{t-1}$ is $\mathcal{F}_{t-1}$ measurable, so
$$
\begin{aligned}
\mathbb{E}\left[M_t\mid\mathcal{F}_{t-1}\right] 
=& \mathbb{E}\left[M_{t-1}D_t\mid\mathcal{F}_{t-1}\right]\\
=& M_{t-1}\mathbb{E}\left[D_t \mid \mathcal{F}_{t-1}\right]\\
\leq& M_{t-1}
\end{aligned}
$$
By the law of iterated expectation,
$$
\begin{aligned}
\mathbb{E}\left[M_n\right]
=&\mathbb{E}\left[\mathbb{E}\left[M_n\mid\mathcal{F}_{n-1}\right]\right]\\
\leq& \mathbb{E}\left[M_{n-1}\right]
\end{aligned}
$$
Repeating the process $n$ times, or elegantly using the mathematical induction on $n$ gives
$$
\mathbb{E}\left[M_n\right]
\leq 1
$$
which implies that $\sum_{t=1}^nX_t$ is $\sigma^2t$-subGaussian. 
Use Markov's inequality on $M_n$ with $a=\frac{1}{\delta}$ gives
$$
\mathbb{P}\left[M_n\geq\frac{1}{\delta}\right]\leq\delta
$$
and rearranging the terms using $M_n=\exp\left(s\sum_{t=1}^nX_n-\frac{s^2\sigma^2n}{2}\right)$ gives
$$
\mathbb{P}\left[\sum_{t=1}^nX_t\geq\frac{s\sigma^2n}{2}+\frac{1}{s}\log{\frac{1}{\delta}}\right]\leq\delta
$$
for $s>0$.
Choose $s=\frac{1}{\sigma}\sqrt{\frac{2}{n}\log{\frac{1}{\delta}}}$ to minimize the righthand side and get
$$
\mathbb{P}\left[\sum_{t=1}^n X_t\geq \sigma\sqrt{2n\log{\frac{1}{\delta}}}\right]\leq\delta
$$
Taking union bound with the inequality that $X_t$ is replaced with $-X_t$ leads to the desired result.
$$
\mathbb{P}\left[\left|\sum_{t=1}^n X_t\right|\geq \sigma\sqrt{2n\log{\frac{2}{\delta}}}\right]\leq\delta
$$
$\square$

Note that the number of random variables $n$ and $\sigma^2$ is a fixed value.
Many commit the error of using random $n$ or random $\sigma$.

As the setting is generalized, I will have to rewrite the confidence intervals.
Recall that $N_{a, t}$ is the number of times the action $a$ is taken up to time $t$, and $\hat{\mu}_{a, t}$ is the average of rewards given by choosing $a$.
If the action $a$ was chosen at time indices $t_1, t_2, ..., t_{N_{a, t}}$ then
$$
\hat{\mu}_{a, t}=\frac{1}{N_{a, t}}\sum_{k=1}^{N_{a, t}}\left(\mu_a+X_{t_k}\right)
$$
which leads to
$$
\left|\hat{\mu}_{a, t}-\mu_{a}\right| = \left|\frac{1}{N_{a, t}}\sum_{k=1}^{N_{a, t}}X_{t_k}\right|
$$
Then by the Azuma inequality, with probability at least $1-\delta$, $\left|\sum_{k=1}^{N_{a, t}}X_{t, k}\right|\leq\sigma\sqrt{2N_{a, t}\log{\frac{1}{\delta}}}$, so
 we can take $\beta_{a, t}\left(1-\delta\right)=\sigma\sqrt{\frac{2}{N_{a, t}}\log{\frac{2}{\delta}}}$. Well... $N_{a, t}$ is a random variable for fixed $t$ so can we?


# Verifying the $TK$ union bound

As I said in the introduction, the algorithm only encounters $T$ distinct confidence intervals.
If an action $a$ is selected only twice, only two confidence intervals need to be valid, which are $\left[\mu_{a, t_1}-\frac{1}{\sigma}\sqrt{\frac{2}{1}\log{\frac{TK}{\delta}}}, \mu_{a, t_1}+\frac{1}{\sigma}\sqrt{\frac{2}{1}\log{\frac{TK}{\delta}}}\right]$ and $\left[\mu_{a, t_2}-\frac{1}{\sigma}\sqrt{\frac{2}{2}\log{\frac{TK}{\delta}}}, \mu_{a, t_2}+\frac{1}{\sigma}\sqrt{\frac{2}{2}\log{\frac{TK}{\delta}}}\right]$.

For $a\in A$ and $1\leq k \leq T$, let $Y_{a, k}$ be $X_{t_k}$, the noise at the $k$-th selection of $a$, if $k\leq N_{a, T}$, 0 otherwise.
$$
Y_{a, k}=\begin{cases}
X_{t_k} & (k\leq N_{a, T})\\
0 & (k>N_{a, T})
\end{cases}
$$

$Y_{a, k}$ is a well-defined random variable. 
Also it is conditionally $\sigma^2$-subGaussian.
Let $\mathcal{G}_k=\sigma\left(Y_{a, 1}, ..., Y_{a, k}\right)$ and $\mathcal{G}_0=\mathcal{F}_0$.
$$
\begin{aligned}
    \mathbb{E}\left[e^{sY_{a, k}}\mid\mathcal{G}_{k-1}\right]
    \leq& 
    \mathbb{E}\left[e^{sY_{a, k}}\left(\sum_{t=1}^T\mathbf{1}\left(t_k=t\right)+\mathbf{1}\left(k>N_{a, T}\right)\right)\mid\mathcal{G}_{k-1}\right]\\
    \leq& \sum_{t=1}^T\mathbb{E}\left[e^{sY_{a, k}}\mathbf{1}(t_k=t)\mid\mathcal{G}_{k-1}\right]+\mathbb{E}\left[e^{sY_{a, k}}\mathbf{1}(k>N_{a, T})\mid\mathcal{G}_{k-1}\right]\\
    \leq& \sum_{t=1}^T\mathbb{E}\left[e^{sX_t}\mathbf{1}\left(t_k=t, a_t = a\right)\mid\mathcal{G}_{k-1}\right]+\mathbb{E}\left[\mathbf{1}(k>N_{a, T})\mid\mathcal{G}_{k-1}\right]
\end{aligned}
$$
Note that $e^{sY_{a, k}}\mathbf{1}\left(t_k=t\right)$ is $\mathcal{F}_{t}$-measurable.

I claim that the $TK$ union bounds are taken over $Y_{a, k}$ for $a=1, ..., K$ and $k=1, ..., T$.

# Time Uniform Bounds - Union Bound

> **Theorem** (Time uniform Azuma's inequality 1) Let $\left\{X_t\right\}_{t=1}^\infty$ be a sequence of conditionally $\sigma^2$-subGaussian random variables.
> Then for any $\delta$,
> $$
\mathbb{P}\left[\exists n\in\mathbb{N} : \left|\sum_{t=1}^nX_t\right|\geq\sigma\sqrt{2n\log{\frac{4n^2}{\delta}}}\right]\leq \delta
> $$
*Proof* : By Azuma's inequality with $\frac{\delta}{2n^2}$ instead of $\delta$,
$$
\mathbb{P}\left[\left|\sum_{t=1}^nX_t\right|\geq\sigma\sqrt{2n\log{\frac{4n^2}{\delta}}}\right]\leq \frac{\delta}{2n^2}
$$
holds. Take union bound over $n\in\mathbb{N}$ and use $\sum_{n=1}^\infty \frac{1}{2n^2}=\frac{\pi^2}{12}\leq 1$. $\square$

Even if we do not know the time horizon $T$, we can still take $\beta_{a, t}(1-\delta/K) = \sigma\sqrt{\frac{2}{N_{a, t}}\log\frac{4KN_{a, t}^2}{\delta}}$.
Simliar argument can show that the regret of UCB algorithm until time $T$ is bounded by $???$ with probability at least $\delta$. 

However, using union bound is not optimal to obtain a time uniform bound.
The equality of union bound holds when all the events are mutually exclusive.
In case of Azuma's inequality, violation of the inequalities at $n$ and $n+1$ are highly positively correlated.
Of course, if $\sum_{t=1}^n X_t$ is way far away from its expectation, so will $\sum_{t=1}^{n+1} X_t$.
In simple words, the events that the inequalities are violated overlaps a lot, while taking union bound means one considers the case where all the events are disjoint.
I recently found out that obtaining a tighter bound is simpler than I expected, so I introduce it.

# Time Uniform Bounds - Supermartingale

> **Definition** A sequence of random variables $\left\{X_t\right\}_{t=1}^\infty$ adapted to filtration $\left\{\mathcal{F}_t\right\}_{t=0}^\infty$ is a supermartingale if $\mathbb{E}\left[X_t\mid\mathcal{F}_{t-1}\right]=X_{t-1}$ for all $t\geq1$.

> **Theorem** (Ville's maximal inequality) If $\left\{X_t\right\}_{t=1}^\infty$ is a nonnegative supermartingale, then for any $a\geq0$,
> $$
a\mathbb{P}\left[\sup_{t\geq1}X_t\geq a\right]\leq \mathbb{E}\left[X_1\right]
> $$
*Proof* : I will use the fact that nonnegative supermartingale converges almost surely.
The proof for this fact is quite complicated and long, so I omit it.
Let $N=\min\left\{t\in\mathbb{N} : X_t\geq a \right\}$ be a stopping time with respect to $\left\{X_t\right\}_{t=1}^\infty$ where $N=\infty$ if $\sup_{t\geq1}X_t < a$.
Since $\left\{X_t\right\}_{t=1}^\infty$ converges almost surely, $X_N$ is well defined almost surely no matter $N=\infty$. Let $Q_t = X_{\min(t, N)}$.
$$
\begin{aligned}
\mathbb{E}\left[Q_{t+1}\right]
=&\mathbb{E}\left[Q_{t+1}\mathbf{1}\left(t\geq N\right)+Q_{t+1}\mathbf{1}\left(t < N\right)\right]\\
=&\mathbb{E}\left[Q_t\mathbf{1}(t\geq N)\right]+\mathbb{E}\left[X_{t+1}\mathbf{1}\left(t<N\right)\right]
\end{aligned}
$$
$\mathbf{1}(t<N)$ is $\mathcal{F}_{t}$ measurable, so
$$
\begin{aligned}
\mathbb{E}\left[X_{t+1}\mathbf{1}(t<N)\right]
=&\mathbb{E}\left[\mathbb{E}\left[X_{t+1}\mid\mathcal{F}_t\right]\mathbf{1}(t<N)\right]\\
\leq& \mathbb{E}\left[X_t\mathbf{1}(t<N)\right]\\
=& \mathbb{E}\left[Q_t\mathbf{1}(t<N)\right]
\end{aligned}
$$

By Fatou's lemma,
$$
\begin{aligned}
\mathbb{E}\left[X_N\right]
=&\mathbb{E}\left[\lim_{t\rightarrow\infty}Q_t\right]\\
\leq& \liminf_{t\rightarrow\infty}\mathbb{E}\left[Q_t\right]\\
\leq& \mathbb{E}\left[X_1\right]
\end{aligned}
$$

$$
\begin{aligned}
a\mathbb{P}\left[\sup_{t\geq1}X_t\geq a\right]
=& a\mathbb{P}\left[N<\infty\right]\\
=& a\mathbb{P}\left[X_N\geq a, N<\infty\right]\\
\leq& a\mathbb{P}\left[X_N\geq a\right]\\
\leq& \mathbb{E}\left[X_N\right]\\
\leq& \mathbb{E}\left[X_1\right]
\end{aligned}
$$


> **Theorem** (Time-Uniform Azuma's inequality 2) Let $\left\{X_t\right\}_{t=1}^\infty$ be a sequence of conditionally $\sigma^2$-subGaussian random variables.
> Then for any $\delta>0$, the following holds.
> $$
\mathbb{P}\left[\exists t\in\mathbb{N}: \left|\sum_{s=1}^t X_t\right|\geq2\sigma\sqrt{t\left(2\log\log{2t}+\log\frac{10}{\delta}\right)}\right]\leq\delta
> $$
*Proof* : For $j\geq0$, let $t_j = 2^j$ and $I_j=\left\{t_j, t_j+1, ..., t_{j+1}-1\right\}$.
Let $M_t(s_j) = \exp\left(s_j\sum_{i=1}^t X_t-\frac{s_j^2\sigma^2t}{2}\right)$ where $s_j>0$ is a fixed value.
$M_t(s_j)$ is a supermartingale, so by Ville's theorem,
$$
\mathbb{P}\left[\exists t\geq1 : M_t(s_j)\geq\frac{1}{\delta}\right]\leq \delta
$$
I will use this inequality to bound $\sum_{i=1}^t X_i$ only for $t\in I_j$, and then apply union bound over $I_j$s.
$$
\mathbb{P}\left[\exists t \in I_j: M_t(s_j)\geq\frac{2(j+1)^2}{\delta}\right]\leq \frac{\delta}{2(j+1)^2}
$$
Rearranging the inequallity for a fixed $t\in I_j$ gives the following:
$$
\mathbb{P}\left[\exists t\in I_j : \sum_{i=1}^t X_i \geq \frac{s_j\sigma^2t}{2}+\frac{1}{s_j}\log{\frac{2(j+1)^2}{\delta}}\right]\leq \frac{\delta}{2(j+1)^2}
$$
Unlike the Azuma's inequality for fixed length, one cannot choose $s_j$ that depends on $t$.
The trick is to replace $t$ with $t_j$ using that $t<2t_j$.
Increasing $t$ leads to smaller probability for the inequality to hold.

$$
\begin{aligned}
&\mathbb{P}\left[\exists t\in I_j : \sum_{i=1}^t X_i \geq s_j\sigma^2t_j+\frac{1}{s_j}\log{\frac{2(j+1)^2}{\delta}}\right]\\
\leq&
\mathbb{P}\left[\exists t\in I_j : \sum_{i=1}^t X_i \geq \frac{s_j\sigma^2t}{2}+\frac{1}{s_j}\log{\frac{2(j+1)^2}{\delta}}\right]\\
\leq& \frac{\delta}{2(j+1)^2}
\end{aligned}
$$

Choose $s_j = \sqrt{\frac{1}{\sigma^2t_j}\log{\frac{2(j+1)^2}{\delta}}}$ and get
$$
\mathbb{P}\left[\exists t\in I_j : \sum_{i=1}^t X_i \geq 2\sigma\sqrt{t_j\log{\frac{2(j+1)^2}{\delta}}}\right]\leq\frac{\delta}{2(j+1)^2}
$$
To express the righthand side with $t$, use $t_j\leq t$ and $(j+1)=\log_2 2t_j\leq \log_2 2t$.

$$
\begin{aligned}
2\sigma\sqrt{t_j\log\frac{2(j+1)^2}{\delta}}
\leq&
2\sigma\sqrt{t\log{\frac{2(\log_2 2t)^2}{\delta}}}\\
=&2\sigma\sqrt{t\left(2\log\log{2t} + \log\frac{2}{\left(\log{2}\right)^2\delta}\right)}\\
\leq& 2\sigma\sqrt{t\left(2\log\log{2t} + \log\frac{5}{\delta}\right)}
\end{aligned}
$$
Finally we get
$$
\begin{aligned}
\mathbb{P}\left[\exists t\in I_j : \sum_{i=1}^t X_i \geq 2\sigma\sqrt{t\left(2\log\log{2t}+\log{\frac{5}{\delta}}\right)}\right]
\leq\frac{\delta}{2(j+1)^2}
\end{aligned}
$$
Taking union boud over $j\geq0$ completes the proof.
$$
\mathbb{P}\left[\exists t\in \mathbb{N} : \sum_{i=1}^t X_i \geq 2\sigma\sqrt{t\left(2\log\log{2t}+\log{\frac{5}{\delta}}\right)}\right]
\leq\delta
$$
$\square$

*Remark* The constants in the previous theorem can be much more improved. I decided to focus on the fact that the scale of $\log\log t$ is achievable instead of $\log t$.

# Tighter Time Uniform Bound

The previous theorem tells us that we can take
$$
\beta_{a, t}(1-\delta/K)=2\sigma\sqrt{\frac{1}{N_{a, t}}\left(2\log\log{2N_{a, t}}+\log\frac{10K}{\delta}\right)}
$$
and run the UCB algorithm : choose the action with the highest $\hat{\mu}_{a, t}+\beta_{a, t}(1-\delta/K)$.
Rough calculation leads to

$$
\begin{aligned}
\sum_{t=K+1}^T 2\beta_{a_t, t}(1-\delta/K)
\leq& \sum_{a=1}^K\sum_{n=1}^{N_{a, T}} 2\sigma\sqrt{\frac{1}{n}\left(2\log\log2n+\log\frac{10K}{\delta}\right)}\\
\leq& 2\sigma\sqrt{2\log\log2T + \log\frac{10K}{\delta}}\sum_{a=1}^K\sum_{n=1}^{N_{a, T}}\frac{1}{\sqrt{n}}\\
\leq& 2\sigma\sqrt{2\log\log2T + \log\frac{10K}{\delta}}\sum_{a=1}^K 2\sqrt{N_{a, T}}\\
\leq& 4\sigma\sqrt{2\log\log2T + \log\frac{10K}{\delta}}\times\sqrt{KT}\\
=& 4\sigma\sqrt{KT\left(\log\left(\frac{10(\log2T)^2K}{\delta}\right)\right)}
\end{aligned}
$$
Therefore we achieve $O\left(K+\sqrt{KT\log\left(\frac{K\log T}{\delta}\right)}\right)$ cumulative regret with probability at least $1-\delta$, which is slightly better than the previous $O\left(K+\sqrt{KT\log\left(\frac{K T}{\delta}\right)}\right)$ regret.
