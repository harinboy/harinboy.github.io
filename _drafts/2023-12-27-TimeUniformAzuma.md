---
layout: post
title:  "Tighter and Time-uniform Concentration Inequality for UCB Algorithm"
date: 2023-12-27 13:00
category: reinforcement-learning
math: true
---

# Introduction

In the previous [post](/_ posts/2023-10-31-UCB-Algorithm.md) I introduced and proved a $O \left( \sqrt{KT\log\frac{KT}{\delta}} + K \right)$ regret bound of the UCB algorithm.
The final part of the proof was taking union bound over $KT$ intervals, resulting the $\log{KT}$ term.
However, if you think about it, the agent encounters only $T$ confidence intervals that must hold, since only one confidence interval is updated after each action seletion.
I found out that many sources do not make it clear, or even commit error, when explaining why one should take union bound over $KT$ intervals.
This post is composed of two parts.
First, I will provide a correct proof for the intervals used in the UCB algorithm under a generalized setting.
Then I will provide a slightly asymtotically tighter bound based on the observations made during the process.  
Unlike the previous post, this post will be full of mathematical proofs, and also the readers are expected to have some knowledge about probability theory based on measure theory.
This is **not** an introduction.

Then, based on the ideas obtained during the explanation, I will provide that $O \left( \sqrt{KT\log\frac{K\log T}{\delta}} + K \right)$ regret is achievable.


# Time Uniform Bounds - Union Bound

I will provide a tighter high probability time-uniform bound.
The time-uniform bounds have the following form

$$
\mathbb{P}\left[ \exists n \in \mathbb{N} : \left| \sum_ {t=1}^n X_ t\right| \geq \beta_ {n}^\infty \right] \leq \delta
$$

It implies that with probability $1-\delta$, $\left| \sum_ {t=1}^n X_ t\right| < \beta_ {n}^\infty$ holds for "all" $n\in\mathbb{N}$, hence the term "time-uniform".
Time-uniform bound enables the algorithm to function without knowing the value of $T$.
I will first show the most basic way to obtain a time-uniform bound.

> **Theorem** (Time uniform Azuma's inequality 1) Let $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ be a sequence of conditionally $\sigma$-subGaussian random variables.
> Then for any $\delta$,
> 
> $$
\mathbb{P}\left[\exists n\in\mathbb{N} : \left|\sum_ {t=1}^nX_ t\right|\geq\sigma\sqrt{2n\log{\frac{\pi^2n^2}{3\delta}}}\right]\leq \delta
> $$

*Proof* : By Azuma's inequality with $\frac{6\delta}{\pi^2n^2}$ instead of $\delta$,

$$
\mathbb{P}\left[\left|\sum_ {t=1}^nX_ t\right|\geq\sigma\sqrt{2n\log{\frac{\pi^2 n^2}{3\delta}}}\right]\leq \frac{6\delta}{\pi^2 n^2}
$$

holds. Take union bound over $n\in\mathbb{N}$ and use $\sum_ {n=1}^\infty \frac{1}{n^2}=\frac{\pi^2}{6}$. $\square$

Even if we do not know the time horizon $T$, we can still take $\beta_ {a, t}^\infty(1-\delta/K) = \sigma\sqrt{\frac{2}{N_ {a, t}}\log\frac{\pi^2 KN_ {a, t}^2}{3\delta}}$, which is asymptotically the same rate with the case when $T$ is known.

However, using union bound is not optimal to obtain a time uniform bound.
The equality of union bound holds when all the events are mutually exclusive.
In case of Azuma's inequality, violation of the inequalities at $n$ and $n+1$ are very likely to happen together.
I have recently found out that a tighter bound can be obtained and I will introduce it in the simplest way I can.

# Time Uniform Bounds - Supermartingales

> **Definition** (Supermartingale) A sequence of random variables $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ adapted to filtration $\left\lbrace\mathcal{F}_ t\right\rbrace_ {t=0}^\infty$ is a supermartingale if $\mathbb{E}\left[X_ t\mid\mathcal{F}_ {t-1}\right] \leq X_ {t-1}$ for all $t\geq1$.

Supermartingales can be understood as a sequence of random variables that decreases in expectation over time.
Supermartingales have the following important property, which resembles a time-uniform version of Markov inequality.

> **Theorem** (Ville's maximal inequality) If $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ is a nonnegative supermartingale, then for any $a\geq0$,
> 
> $$
a\mathbb{P}\left[ \exists n \in \mathbb{N} : X_ n\geq a\right]\leq \mathbb{E}\left[X_ 1\right]
> $$

The proof is a little bit long and involved. I omit the proof here, but I leave a link for those who are curious.
[https://www.stat.cmu.edu/~aramdas/martingales18/L13-Ville's.pdf](https://www.stat.cmu.edu/~aramdas/martingales18/L13-Ville's.pdf)

I had implicitly constructed a supermartingale in the proof of generailized Azuma's inequlaity.
Recall that $M_ n = \exp\left(s\sum_ {t=1}^n X_ t - \frac{s^2\sigma^2n}{2}\right)$ has the property $\mathbb{E}\left[ M_ n \mid \mathcal{F}_ {n-1}\right]\leq M_ {n-1}$.
But even if one uses Ville's maximal inequality, there still is the matter of choosing the value $s$, which depended on $t$.
The idea is to partition the set of natural numbers again so that for all the $t$ in the same group, one value of $s$ would suffice.

> **Theorem** (Time-Uniform Azuma's inequality 2) Let $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ be a sequence of conditionally $\sigma$-subGaussian random variables.
> Then for any $\delta>0$, the following holds.
> 
> $$
\mathbb{P}\left[\exists n\in\mathbb{N}: \left|\sum_ {t=1}^n X_ t\right|\geq2^{\frac{3}{4}}\sigma\sqrt{n\log\frac{7(\log 2n)^2}{\delta}}\right]\leq\delta
> $$

*Proof* : For $j\geq0$, let $t_ j = 2^j$ and $I_ j=\left\lbrace t_ j, t_ j+1, ..., t_ {j+1}-1\right\rbrace$.
Let $M_ n(s_ j) = \exp\left(s_ j\sum_ {t=1}^n X_ t-\frac{s_ j^2\sigma^2 n}{2}\right)$ where $s_ j>0$ is a fixed value.
$M_ n(s_ j)$ is a supermartingale, so by Ville's theorem,

$$
\mathbb{P}\left[\exists n\geq1 : M_ n(s_ j)\geq\frac{1}{\delta}\right]\leq \delta
$$

I will use this inequality to bound $\sum_ {t=1}^n X_ t$ only for $n\in I_ j$, and then apply union bound over $j$s. We need the following:

$$
\mathbb{P}\left[\exists n \in I_ j: M_ n(s_ j)\geq\frac{\pi^2(j+1)^2}{6\delta}\right]\leq \frac{6\delta}{\pi^2 (j+1)^2}
$$

Rearranging the inequallity for a fixed $n\in I_ j$ gives the following:

$$
\mathbb{P}\left[\exists n\in I_ j : \sum_ {t=1}^n X_ t \geq \frac{s_ j\sigma^2 n}{2}+\frac{1}{s_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}\right]\leq \frac{6 \delta}{\pi^2 (j+1)^2}
$$

Unlike the Azuma's inequality for fixed length, one cannot choose $s_ j$ that depends on $t$.
However for $n\in I_ j$, one $s_ j$ can be sufficient with a small cost of a constant factor.
Choose $s_j =  \sqrt{\frac{\sqrt{2}}{\sigma^2t_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}}$.
Using that $\frac{n}{2}\leq t_ j \leq n$, the right-hand side is bounded by

$$
\begin{aligned}
\frac{s_ j\sigma^2 n}{2}+\frac{1}{s_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}
=& \frac{n}{2}\sqrt{\frac{\sqrt{2} \sigma^2}{t_ j}\log{\frac{\pi^2(j+1)^2}{6\delta}}} + \sqrt{\frac{\sigma^2t_ j}{\sqrt{2}}\log{\frac{\pi^2(j+1)^2}{6\delta}}} \\
\leq& \frac{n}{2}\sqrt{\frac{2\sqrt{2}\sigma^2 }{n}\log{\frac{\pi^2(j+1)^2}{6\delta}}} + \sqrt{ \frac{\sigma^2 n}{\sqrt{2}} \log{\frac{\pi^2(j+1)^2}{6\delta}}}\\
=& \sqrt{\frac{\sqrt{2}\sigma^2 n}{2}\log{\frac{\pi^2(j+1)^2}{6\delta}}} + \sqrt{ \frac{ \sqrt{2} \sigma^2 n}{2} \log{\frac{\pi^2(j+1)^2}{6\delta}}} \\
=& 2^{\frac{3}{4}}\sigma\sqrt{ n \log \frac{\pi^2(j+1)^2}{6\delta} }
\end{aligned}
$$

Since $j+1 = \log_2 {2t_ j} \leq \log_2 {2n} = \frac{\log {2n}}{\log{2}}$, 

$$
\begin{aligned}
\frac{\pi^2(j+1)^2}{6\delta}
\leq& \left(\frac{\pi^2}{6(\log 2)^2} \right) \frac{(\log{2n})^2}{\delta}\\
\leq& \frac{7(\log 2n)^2}{2\delta}
\end{aligned}
$$

Then finally we obtain

$$
\mathbb{P}\left[\exists n\in I_ j : \sum_ {t=1}^n X_ t \geq 2^{\frac{3}{4}}\sigma\sqrt{ n \log \frac{7(\log 2n)^2}{2\delta} } \right]\leq \frac{6 \delta}{\pi^2 (j+1)^2}
$$

Taking union boud over $j\geq0$ and the inequality where $X_ t$ is replaced with $-X_ t$ completes the proof.

$$
\mathbb{P}\left[\exists n\in \mathbb{N} : \left| \sum_ {t=1}^n X_ t \right| \geq 2^{\frac{3}{4}}\sigma\sqrt{n \log \frac{7 (\log 2n)^2}{\delta}}\right]
\leq\delta
$$

$\square$

# Back to UCB Algorithm

The previous theorem tells us that we can take
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
\end{aligned}
$$

Therefore we achieve $O\left(K+\sqrt{KT\log\left(\frac{K\log T}{\delta}\right)}\right)$ cumulative regret with probability at least $1-\delta$, which is slightly better than the previous $O\left(K+\sqrt{KT\log\left(\frac{K T}{\delta}\right)}\right)$ regret.

# Conclusion

In this post, I explained why 
The question originated from a wrong proof for the regret bound of UCB algorithm.
The proof led me to think that the $\log {KT}$ term can be improved to $\log{T}$.
After some studying I realized that the proof is wrong.

The counterexample for random length Azuma inequality and the proof for the tighter time-uniform Azuma inequality are motivated by the proof of law of iterated logarithm.

# Reference

[1] Tor Lattimore and Csaba Szepesvari. "Bandit
algorithms.", 2019.  
[2] Steven R Howard, Aaditya Ramdas, Jon McAuliffe, and Jasjeet Sekhon. "Time-uniform, nonparametric,
nonasymptotic confidence sequences." The Annals of Statistics, 2021.  
[3] Aurelien Garivier. "Informational confidence bounds for self-normalized averages and  applications." arXiv:1309.3376, 2013.