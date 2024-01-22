---
layout: post
title:  "Tighter Time-Uniform Concentration Inequality for the UCB Algorithm"
date: 2024-01-03 11:00
category: reinforcement-learning
math: true
---

# Introduction

In the previous [post](/posts/UCB_Algorithm2), I elaborated on a common pitfall and provided a solution regarding the union bound over a set of randomly selected events.
I explained in detail why the union bound over $KT$ events must be taken in the proof of the UCB algorithm.

I will improve the result from the previous post in two ways.  
First, I will address the case where $T$ is unknown or infinite.
In our previous approach, we required the value of $T$ to determine the number of events to apply the union bound over.
However, when $T$ is unknown or possibly infinite, we need a different way of taking the union bound.  
Second, I will show that a tighter inequality can be achieved when bounding the sum of $n$ subGaussian random variables for all possible values of $n$.
In our previous analysis, we applied the union bound over the $KT$ events, resulting in a $\log\frac{KT}{\delta}$ term.
I will show that it is possible to sharpen this term to $\log \frac{K\log{T}}{\delta}$.

It is strongly recommended to read the previous post.
Also, the readers are expected to be familiar about probability theory based on measure theory.

# Time-Uniform Confidence Bounds - Union Bound

The time-uniform confidence bounds are confidence bounds with the following form.

$$
\mathbb{P}\left[ \exists n \in \mathbb{N} : \left| \sum_ {t=1}^n X_ t\right| \geq \beta_ {n}^\infty(1 - \delta) \right] \leq \delta
$$

The probability of the series exceeding the bound at least once is at most $\delta$.
It implies that with probability at least $1-\delta$, $\left| \sum_ {t=1}^n X_ t\right| < \beta_ {n}^\infty(1 - \delta)$ holds for "all" $n\in\mathbb{N}$, hence the term "time-uniform".
To distinguish it from $\beta_ n(1 - \delta)$ used in previous posts, which bounds $\left| \sum_ {t=1}^n X_ t\right|$ for a specific value of $n$ with a probability of at least $1 - \delta$, I have added an $\infty$ sign.
The time-uniform confidence bounds enable the UCB algorithm to function without knowing the value of $T$ or when $T$ can be infinite.
The algorithm can utilize $\beta_ t^{\infty} \left( 1 - \frac{\delta}{K}\right)$ instead of $\beta_ t\left( 1 - \frac{\delta}{KT} \right)$ and take the union bound over the $K$ actions.
Then, all the confidence intervals discussed in the previous post are valid with probability at least $1 - \delta$.

I will first show the most basic way to obtain a time-uniform confidence bound.

> **Theorem** (Time-uniform Azuma's inequality 1) Let $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ be a sequence of conditionally $\sigma$-subGaussian random variables.
> Then for any $\delta$,
> 
> $$
\mathbb{P}\left[\exists n\in\mathbb{N} : \left|\sum_ {t=1}^nX_ t\right|\geq\sigma\sqrt{2n\log{\frac{\pi^2n^2}{3\delta}}}\right]\leq \delta
> $$

*Proof* : By the Azuma's inequality with $\frac{6\delta}{\pi^2n^2}$ instead of $\delta$,

$$
\mathbb{P}\left[\left|\sum_ {t=1}^nX_ t\right|\geq\sigma\sqrt{2n\log{\frac{\pi^2 n^2}{3\delta}}}\right]\leq \frac{6\delta}{\pi^2 n^2}
$$

holds.
Take the union bound over $n\in\mathbb{N}$ and use $\sum_ {n=1}^\infty \frac{1}{n^2}=\frac{\pi^2}{6}$. $\square$

Even if we do not know the time horizon $T$, we can still take $\beta_ {a, t}^\infty(1-\delta/K) = \sigma\sqrt{\frac{2}{N_ {a, t}}\log\frac{\pi^2 KN_ {a, t}^2}{3\delta}}$.
Note that it achieves the same asymptotic rate with $\beta_{a, t}(1 - \delta/KT) = \sigma \sqrt{\frac{2}{N_{a, t}} \log \frac{2KT}{\delta}}$.

However, taking the union bound is not optimal.
The equality of the union bound holds when all the events are mutually exclusive.
In the case of Azuma's inequality, the violations of the inequalities at $n$ and $n+1$ are very likely to occur together.
I recently found out that a tighter bound can be obtained through careful analysis, and I will present it in the simplest way possible.

# Time-Uniform Confidence Bounds - Supermartingales

> **Definition** (Supermartingale) A sequence of random variables $\left\lbrace X_ t\right\rbrace_ {t=0}^\infty$ adapted to filtration $\left\lbrace\mathcal{F}_ t\right\rbrace_ {t=0}^\infty$ is a supermartingale if $\mathbb{E}\left[X_ t\mid\mathcal{F}_ {t-1}\right] \leq X_ {t-1}$ for all $t\geq1$.

Supermartingales can be understood as sequences of random variables that decrease over time in expectation.
They have the following important property, which resembles a time-uniform version of Markov inequality.

> **Theorem** (Ville's maximal inequality) If $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ is a nonnegative supermartingale, then for any $c\geq0$,
> 
> $$
c\mathbb{P}\left[ \exists n \in \mathbb{N} : X_ n\geq c\right]\leq \mathbb{E}\left[X_ 1\right].
> $$

*Proof* I will have to use the following properties of supermartingales without proofs, as including them would take up an inordinate portion of this post.
Their proofs can be found in "Probability: Theory and Examples" [1].

Property 1. (Convergence of nonnegative supermartigales) $X_ \infty = \lim_ {n \rightarrow \infty} X_ n$ is well-defined, i.e. the limit converges, almost surely.  
Property 2. (Optional stopping theorem) If $N$ is a stopping time with respect to $\left \lbrace \mathcal{F}_ t \right\rbrace_ {t=0}^\infty$, then $\mathbb{E}\left[ X_ N \right] \leq \mathbb{E}\left[ X_ 1 \right]$.

Let $N = \min \left\lbrace n \in \mathbb{N} : X_ n \geq c \right\rbrace$ where $\min \emptyset = \infty$.
$N$ is the first $n$ such that $X_ n \geq c$ occurs, or infinity if such $n$ does not exist.
By property 1, $X_ N$ is a well-defined random variable.
Also, $N$ is a stopping time with respect to $\left\lbrace \mathcal{F}_ t \right\rbrace_{t=0}^\infty$.
Then, 

$$
\begin{aligned}
    \mathbb{E}\left[ X_ 1 \right]
    & \geq \mathbb{E} \left[ X_ N \right]
    \\
    & \geq c \mathbb{P} \left[ X_ N \geq c \right]
    \\
    & \geq c \mathbb{P} \left[ X_ N \geq c, N < \infty \right]
    \\
    & = c \mathbb{P} \left[ \exists n \in \mathbb{N} : X_ n \geq c \right],
\end{aligned}
$$

where the first inequality is from property 2, and the second inequality is Markov's inequality.
$\square$

I had implicitly constructed a supermartingale in the proof of generailized Azuma's inequality.
Recall that $M_ n = \exp\left(s\sum_ {t=1}^n X_ t - \frac{s^2\sigma^2n}{2}\right)$ had the property $\mathbb{E}\left[ M_ n \mid \mathcal{F}_ {n-1}\right]\leq M_ {n-1}$.
Then I proceeded by using Markov's inequality on $M_ n$.
Will replacing Markov's inequality with Ville's inequality result a time uniform bound?
Let's try.
I will briefly go through the whole proof of the Azuma's inequality using $\sigma$-algebras.

Let $\lbrace X_ t \rbrace_ {t = 1}^\infty$ be a sequence of conditionally $\sigma$-subGaussian random variables adapted to a filtration $\lbrace \mathcal{F}_ t \rbrace_ {t = 0}^\infty$.
It means that each $X_ t$ is $\mathcal{F}_ t$-measurable and $\mathbb{E}\left[ \exp\left( s X_ t - \frac{s^2 \sigma^2}{2} \right) \mid \mathcal{F}_ {t-1} \right] \leq 1$ holds for all $s\in \mathbb{R}$.
I had defined $D_ t = \exp\left( s X_ t - \frac{s^2 \sigma^2}{2} \right)$ and $M_ t = D_ 1 D_ 2 \cdots D_ t$, where $M_ 0 = 1$.
Note that $M_ {t-1}$ is $\mathcal{F}_ {t-1}$-measurable and $\mathbb{E}\left[ D_ t \mid \mathcal{F}_ {t-1} \right] \leq 1$.
Therefore, we have

$$
\begin{aligned}
    \mathbb{E}\left[ M_ t \mid \mathcal{F}_ {t-1} \right]
    & = \mathbb{E}\left[ M_ {t-1} D_ t \mid \mathcal{F}_ {t-1} \right]
    \\
    & = M_ {t-1} \mathbb{E}\left[  D_ t \mid \mathcal{F}_ {t-1} \right]
    \\
    & \leq M_ {t-1}.
\end{aligned}
$$

I have proved that $\left\lbrace M_ t \right\rbrace_ {t = 0}^\infty$ is a supermartingale.
When proving the Azuma's inequality, I had used Markov's inequality.
Instead, let's try Ville's maximal inequality.
Choose $c = \frac{1}{\delta}$ and apply Ville's inequality on $\left\lbrace M_ t \right\rbrace_ {t = 0}^\infty$.
We have

$$
\begin{aligned}
    \mathbb{P}\left[ \exists n \in \mathbb{N} : M_ n \geq \frac{1}{\delta} \right] \leq \delta .
\end{aligned}
$$

Since $M_ n = \exp \left( \sum_ {t = 1}^n s X_ t - \frac{s^2 \sigma^2 n}{2} \right)$, taking logarithms and rearranging the terms yield

$$
\mathbb{P}\left[ \exists n \in \mathbb{N} : \sum_ {t = 1}^n s X_ t \geq \frac{s^2 \sigma^2 n}{2} + \log \frac{1}{\delta} \right] \leq \delta.
$$

In the case of the generalized Azuma's inequality, the proof was completed by taking $s = \frac{1}{\sigma} \sqrt{ \frac{2}{n} \log \frac{1}{\delta}}$.
However, in this case, the value of $n$ is not fixed.
Also, we cannot take different values of $s$ for each $n$ since it would give a bound for a weighted sum of $X_ t$, namely, $\sum_ {t = 1}^n s_ t X_ t$, instead of $\sum_ {t = 1}^n X_ t$.
If we take $s = \frac{1}{\sigma} \sqrt{ \frac{2}{m} \log \frac{1}{\delta}}$ for some $m > 0$ nonetheless, then we get the following result.

$$
\mathbb{P}\left[ \exists n \in \mathbb{N} : \sum_ {t = 1}^n  X_ t \geq \sigma \left( \frac{n}{\sqrt{m}} + \sqrt{m} \right) \sqrt{\frac{1}{2} \log \frac{1}{\delta} }  \right] \leq \delta.
$$

$\frac{n}{\sqrt{m}} + \sqrt{m}$ is small when $m$ is close to $n$, and achieves its minimum at $m = n$.
If $n$ is much smaller than $m$, the term $\sqrt{m}$ becomes too big compared to the $\sqrt{n}$ rate we desire.
If $n$ is much larger than $m$, the term $\frac{n}{\sqrt{m}}$ scales linearly with $n$, which is again too big.
The inequality above is only meaningful when $n$ is close to $m$.
The solution is to partition the set of natural numbers so that for $n$s in the same group, a single value of $s$ would suffice.

> **Theorem** (Time-uniform Azuma's inequality 2) Let $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ be a sequence of conditionally $\sigma$-subGaussian random variables.
> Then for any $\delta>0$, the following holds.
> 
> $$
\mathbb{P}\left[\exists n\in\mathbb{N}: \left|\sum_ {t=1}^n X_ t\right|\geq2^{\frac{3}{4}}\sigma\sqrt{n\log\frac{7(\log 2n)^2}{\delta}}\right]\leq\delta
> $$

*Proof* : For $j\geq0$, let $t_ j = 2^j$ and $I_ j=\left\lbrace t_ j, t_ j+1, ..., t_ {j+1}-1\right\rbrace$, so that

$$
\begin{aligned}
    I_ 0 =& \lbrace 1 \rbrace \\
    I_ 1 =& \lbrace 2, 3 \rbrace \\
    I_ 2 =& \lbrace 4, 5, 6, 7 \rbrace \\
    \vdots
\end{aligned}
$$

Let $M_ n(s_ j) = \exp\left(s_ j\sum_ {t=1}^n X_ t-\frac{s_ j^2\sigma^2 n}{2}\right)$ where $s_ j>0$ is a fixed value.
$M_ n(s_ j)$ is a supermartingale, so by Ville's maximal inequality,

$$
\mathbb{P}\left[\exists n\geq1 : M_ n(s_ j)\geq\frac{1}{\delta}\right]\leq \delta .
$$

I will use this inequality to bound $\sum_ {t=1}^n X_ t$ only for $n\in I_ j$, and then apply union bound over $j$s. To do so, we need to replace $\delta$ by $\frac{6 \delta}{\pi^2(j+1)^2}$.

$$
\mathbb{P}\left[\exists n \in I_ j: M_ n(s_ j)\geq\frac{\pi^2(j+1)^2}{6\delta}\right]\leq \frac{6\delta}{\pi^2 (j+1)^2}
$$

Rearranging the inequallity gives the following:

$$
\mathbb{P}\left[\exists n\in I_ j : \sum_ {t=1}^n X_ t \geq \frac{s_ j\sigma^2 n}{2}+\frac{1}{s_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}\right]\leq \frac{6 \delta}{\pi^2 (j+1)^2} .
$$

Unlike the Azuma's inequality for a fixed length, one cannot choose $s_ j$ that depends on $n$.
However for $n\in I_ j$, one $s_ j$ can be sufficient with a small cost of a constant factor.
Choose $s_ j =  \sqrt{\frac{\sqrt{2}}{\sigma^2t_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}}$.
Using that $\frac{n}{2}\leq t_ j \leq n$, the right-hand side is bounded by

$$
\begin{aligned}
\frac{s_ j\sigma^2 n}{2}+\frac{1}{s_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}
=& \frac{n}{2}\sqrt{\frac{\sqrt{2} \sigma^2}{t_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}} + \sqrt{\frac{\sigma^2t_ j}{\sqrt{2}}\log{\frac{\pi^2(j+1)^2}{6\delta}}} \\
\leq& \frac{n}{2}\sqrt{\frac{2\sqrt{2}\sigma^2 }{n}\log{\frac{\pi^2(j+1)^2}{6\delta}}} + \sqrt{ \frac{\sigma^2 n}{\sqrt{2}} \log{\frac{\pi^2(j+1)^2}{6\delta}}}\\
=& \sqrt{\frac{\sqrt{2}\sigma^2 n}{2}\log{\frac{\pi^2(j+1)^2}{6\delta}}} + \sqrt{ \frac{ \sqrt{2} \sigma^2 n}{2} \log{\frac{\pi^2(j+1)^2}{6\delta}}} \\
=& 2^{\frac{3}{4}}\sigma\sqrt{ n \log \frac{\pi^2(j+1)^2}{6\delta} } .
\end{aligned}
$$

Since $j+1 = \log_ 2 {2t_ j} \leq \log_ 2 {2n} = \frac{\log {2n}}{\log{2}}$, 

$$
\begin{aligned}
\frac{\pi^2(j+1)^2}{6\delta}
\leq& \left(\frac{\pi^2}{6(\log 2)^2} \right) \frac{(\log{2n})^2}{\delta}\\
\leq& \frac{7(\log 2n)^2}{2\delta} .
\end{aligned}
$$

Then finally we obtain

$$
\mathbb{P}\left[\exists n\in I_ j : \sum_ {t=1}^n X_ t \geq 2^{\frac{3}{4}}\sigma\sqrt{ n \log \frac{7(\log 2n)^2}{2\delta} } \right]\leq \frac{6 \delta}{\pi^2 (j+1)^2} .
$$

Taking union boud over $j\geq0$ and the inequality where $X_ t$ is replaced with $-X_ t$ complete the proof.

$$
\mathbb{P}\left[\exists n\in \mathbb{N} : \left| \sum_ {t=1}^n X_ t \right| \geq 2^{\frac{3}{4}}\sigma\sqrt{n \log \frac{7 (\log 2n)^2}{\delta}}\right]
\leq\delta .
$$

$\square$

*Remark* The constants in the theorem are not tight.
Refer to [2] and [3].

The theorem tells us that we can take
$$
\beta_ {a, t}^\infty(1-\delta/K)=2^{\frac{3}{4}}\sigma\sqrt{\frac{1}{N_ {a, t}}\left(\log\frac{7K(\log 2N_ {a, t})^2}{\delta}\right)}
$$
and run the UCB algorithm without knowing the value of $T$.
Rough calculation leads to

$$
\begin{aligned}
\sum_ {t=K+1}^T 2\beta_ {a_ t, t}^\infty(1-\delta/K)
\leq& \sum_ {a=1}^K\sum_ {n=1}^{N_ {a, T}} 2^{\frac{7}{4}}\sigma\sqrt{\frac{1}{n}\left(\log\frac{7K(\log 2n)^2}{\delta}\right)}\\
\leq& 2^{\frac{7}{4}}\sigma\sqrt{\log\frac{7K(\log 2T)^2}{\delta}}\sum_ {a=1}^K\sum_ {n=1}^{N_ {a, T}}\frac{1}{\sqrt{n}}\\
\leq& 2^{\frac{7}{4}}\sigma\sqrt{\log\frac{7K(\log 2T)^2}{\delta}}\sum_ {a=1}^K 2\sqrt{N_ {a, T}}\\
\leq& 2^{\frac{11}{4}}\sigma\sqrt{\log\frac{7K(\log 2T)^2}{\delta}}\times\sqrt{KT}\\
\leq& 6.8\sigma\sqrt{KT\left(\log\left(\frac{7K(\log2T)^2}{\delta}\right)\right)}
.
\end{aligned}
$$

Therefore we achieve $O\left(K+\sqrt{KT\log\left(\frac{K\log T}{\delta}\right)}\right)$ cumulative regret with probability at least $1-\delta$, which is slightly better than the previous $O\left(K+\sqrt{KT\log\left(\frac{K T}{\delta}\right)}\right)$ regret.

# Law of Iterated Logarithm

Law of iterated logarithm is a strong theorem that describes the behavior of a sum of i.i.d. random variables with finite mean and variance.

> **Theorem** (Law of iterated logarithm) Let $\left \lbrace Y_ n \right\rbrace_ {n = 1}^\infty$ be a sequence of i.i.d. random variables whose mean is zero and variance is one.
> Then,
>
> $$
> \limsup_ {n \rightarrow \infty} \frac{\left| \sum_ {t = 1}^n Y_ t\right |}{\sqrt{2n \log \log {n}}} = 1
> $$
>
> almost surely.

It implies that for any $\varepsilon > 0$, the sequence satisfies $\left| \sum_ {t = 1}^n Y_ t\right | \geq \sqrt{2n \log \log {n}} - \varepsilon$ for infinitely many $n\in\mathbb{N}$ almost surely.
The theorem tells us that a time-uniform, high-probability concentration inequality for sums of conditionally subGaussian random variables that is asymtotically tighter than $O \left( \sqrt{n \log \log n} \right)$ is not achievable.
It means that the regret bound of $O\left(K+\sqrt{KT\log\left(\frac{K \log T}{\delta}\right)}\right)$ is the best bound we can achieve by simply tuning the confidence size parameter $\beta$ of the UCB algorithm.

The proof of the theorem consists of two parts.
Showing that $\limsup_ {n \rightarrow \infty} \frac{\left| \sum_ {t = 1}^n Y_ t\right |}{\sqrt{2n \log \log {n}}} \geq 1$ and $\limsup_ {n \rightarrow \infty} \frac{\left| \sum_ {t = 1}^n Y_ t\right |}{\sqrt{2n \log \log {n}}} \leq 1$.
The construction of the counterexample for the random-lengthed Azuma's inequality in the previous post was motivated by the proof for the lower boundedness of $\limsup_ {n \rightarrow \infty} \frac{\left| \sum_ {t = 1}^n Y_ t\right |}{\sqrt{2n \log \log {n}}}$.
The proof for the $O \left( \sqrt{n \log\log n} \right)$ scale of the time-uniform Azuma's inequality was motivated by the upper boundedness part of the proof.

# Conclusion

In this post I showed that the regret bound of $O\left(K+\sqrt{KT\log\left(\frac{K \log T}{\delta}\right)}\right)$ can be obatained by tuning the parameter $\beta$ of the UCB algorithm appropriately.

This post and the previous post together can serve as answers for the problems in Exercise 7.1 of the book "Bandit Algorithms" [4].

# Reference

[1] Rick Durrett, "Probability: Theory and Examples", 2019.  
[2] Aurelien Garivier. "Informational confidence bounds for self-normalized averages and  applications." arXiv:1309.3376, 2013.  
[3] Steven R Howard, Aaditya Ramdas, Jon McAuliffe, and Jasjeet Sekhon. "Time-uniform, nonparametric,
nonasymptotic confidence sequences." The Annals of Statistics, 2021.   
[4] Tor Lattimore and Csaba Szepesvari. "Bandit algorithms.", 2019.  