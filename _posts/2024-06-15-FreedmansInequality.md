---
layout: post
title:  "Freedman's and Bernstein's Inequality"
date: 2024-06-15 21:00
categories: 
    math
    probability-theory
math: true
---

# Introduction

I have seen so-called "Freedman's inequality" or "Freedman-type inequality" in several bandit literature [1, 2, 3, 4, 5, 6, 7, 8, 9].
These inequalities are said to originate from Freedman (1975) [10].
When I inspected the original paper, I found that people are using slightly weaker results than what the original paper implies.
Furthermore, some do not notice that Freedman's inequality is already time-uniform and redundantly take the union bound over time again.
In this post, I will introduce a high-probability version of Freedman's inequality that is proved by following the arguments of the original paper.

Some call the high-probability version of Freedman's inequality "Bernstein's inequality for martingales".
Others state martingale version of Bernstein's inequality and call it Freedman's inequality.
In this post, I will clarify that Bernstein's inequality holds for martingales and is a special case of Freedman's inequality.
Furthermore, using the idea of my previous post([link](/posts/TimeUniformAzuma/)) that makes Azuma's inequality time-uniform, I will show that the same modification is also possible for Bernstein's inequality.

The readers are expected to have a background in measure-theoretic probability theory, especially $\sigma$-algebras, filtrations, and conditional expectations conditioned on $\sigma$-algebras.

# Preliminaries

Some definitions and a useful lemma are introduced here.
We first define the martingale difference sequence, where bounding its sum is our main interest.

> **Definition 1** (Martingale Difference Sequence, M. D. S.) A sequence of random variables $\lbrace X_ n \rbrace_ {n=1}^\infty$ is called a *martingale difference sequence*, or *m. d. s.*, with repect to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$ if for all $n$,
> $\mathbb{E} [ | X_ n | ] < \infty$, $X_ n \in \mathcal{F}_ n$, and $\mathbb{E} [ X_ n | \mathcal{F}_ {n-1} ] = 0$ hold.

As the name implies, the sum sequence of a martingale difference sequence is called a martingale.
A m. d. s. is a generalization of zero-mean i. i. d. random variables since dependencies between elements are allowed.

> **Definition 2** (Supermartingale) A sequence of random variables $\lbrace X_ n \rbrace_ {n=1}^\infty$ is called *supermartingale* with repect to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$ if for all $n$,
> $\mathbb{E} [ | X_ n | ] < \infty$, $X_ n \in \mathcal{F}_ n$, and $\mathbb{E} [ X_ {n+1} | \mathcal{F}_ {n} ] \le X_ {n}$ hold.

Supermartingales play a crucial role when proving time-uniform inequalities.
The following lemma was introduced in the previous [post](/posts/TimeUniformAzuma/), and I repeat its statement and proof here.

> **Lemma 1** (Ville's maximal inequality) If $\left\lbrace X_ t\right\rbrace_ {t=1}^\infty$ is a nonnegative supermartingale, then for any $c\geq0$,
> 
> $$
c\mathbb{P}\left[ \exists n \in \mathbb{N} : X_ n\geq c\right]\leq \mathbb{E}\left[X_ 1\right].
> $$

*Proof* I will have to use the following properties of supermartingales without proofs, as including them would take up an inordinate portion of this post.
Their proofs can be found in "Probability: Theory and Examples" [11].

Property 1. (Convergence of nonnegative supermartigales) $X_ \infty = \lim_ {n \rightarrow \infty} X_ n$ is well-defined, i.e. the limit converges, almost surely.  
Property 2. (Optional stopping theorem) If $N$ is a stopping time with respect to $\left \lbrace \mathcal{F}_ t \right\rbrace_ {t=0}^\infty$, then $\mathbb{E}\left[ X_ N \right] \leq \mathbb{E}\left[ X_ 1 \right]$.

Let $N = \min \left\lbrace n \in \mathbb{N} : X_ n \geq c \right\rbrace$ where $\min \emptyset = \infty$.
$N$ is the first $n$ such that $X_ n \geq c$ occurs, or infinity if such $n$ does not exist.
By property 1, $X_ N$ is a well-defined random variable.
Also, $N$ is a stopping time with respect to $\left\lbrace \mathcal{F}_ t \right\rbrace_ {t=0}^\infty$.
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


# Freedman's Inequality

> **Theorem 1** (Freedman's Inequality) Let $\lbrace X_ n \rbrace_ {n=1}^\infty$ be a m. d. s. with respect to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$.
> Suppose $X_ n \le 1$ holds almost surely for all $n \in \mathbb{N}$.
> Let $V_ n = \mathbb{E} [ X_ n^2 | \mathcal{F}_ {n-1} ]$ be the conditional variance of $X_ n$.
> Then, for any $\lambda > 0$ and $\delta \in (0, 1]$, it holds that
> 
> $$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge \frac{ e^\lambda - 1 - \lambda}{\lambda} \sum_ {i=1}^n V_ i + \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta \, .
> $$

Freedman's inequality bounds the sum of m. d. s. with the sum of their conditional variances.
Notably, it is time-uniform, meaning that the probability of the sum of random variables crossing the given bound at least once is bounded by $\delta$.
In other words, with probability at least $1 - \delta$, the sum never crosses the given bound.

Theorem 1 is based on the proof of Theorem 1.6 in Freedman (1975) [10].
I have altered the final steps of the proof to obtain a high-probability version of the theorem.

To prove the theorem, we need two lemmas, which require some calculus.

> **Lemma 2** $g : \mathbb{R} \rightarrow \mathbb{R}$ defined as the following is increasing.
> 
> $$
    g(x) = \begin{cases}
        \frac{e^x - 1 - x}{x^2} & x \ne 0
        \\
        \frac{1}{2} & x = 0
    \end{cases}
> $$

*Proof* It is sufficient to show that $g'(x) > 0$ for all $x \ne 0$.
Differentiating the function yields
$g'(x) = \frac{ x e^x - 2 e^x + x + 2}{x^3}$.
Let $h(x) = x e^x - 2 e^x + x + 2$.
Note that $h(0) = 0$.
Now, it is sufficient to prove that $h$ is increasing since then $h(x)$ would have the same sign with $x$, and $g'(x) = \frac{h(x)}{x^3}$ would be positive when $x\ne 0$.
$h'(x) = (x - 1)e^x + 1$ and $h^{(2)}(x) = x e^x$.
It is clear that $h^{(2)}(x) < 0$ when $x < 0$ and $h^{(2)}(x) > 0$ when $x > 0$.
Together with that $h'(0) = 0$, it implies that $h'(x) > 0$ for all $x \ne 0$, which proves that $h$ is increasing.
$\square$

> **Lemma 3** For any $\lambda > 0$ and a random variable $X$ such that $X \le 1$ a. s. and $\mathbb{E}[ X ] = 0$, the following inequality holds:
> 
> $$
    \mathbb{E} \left[ e^{\lambda X} \right] \le e^{ (e^\lambda - 1 - \lambda) \mathbb{E} [ X^2 ]} 
> $$

*Proof* Since $X\le 1$ and $\lambda > 0$, it holds that $\lambda X \le \lambda$, which implies $g(\lambda X) \le g(\lambda)$ by Lemma 2.
Multiplying $\lambda^2 X^2$ on both sides and arranging the terms, we get $e^{\lambda X} \le 1 + \lambda X + (e^{\lambda} - 1 - \lambda) X^2$.
Taking the expectation on the both sidies yields $\mathbb{E} [ e^{\lambda X} ] \le 1 + (e^\lambda - 1 - \lambda) \mathbb{E}[ X^2 ]$.
Since $1 + x \le e^x$ for any $x \in \mathbb{R}$, we obtain $\mathbb{E} [ e^{\lambda X} ] \le e^{(e^{\lambda} - 1 - \lambda) \mathbb{E} [ X^2 ]}$.
$\square$

Now, we are ready to prove Theorem 1.

*Proof of Theorem 1* Let $D_ n = \exp( \lambda X_ n - (e^\lambda - 1 - \lambda) V_ n)$ and $M_ n = \prod_ {i=1}^n D_ i$, where $M_ 0 = 1$.
Note that $M_ n \in \mathcal{F}_ n$ and $M_ n = M_ {n-1} D_ n$ for all $n$.
By Lemma 3,

$$
\begin{aligned}
\mathbb{E} \left[ D_n \mid \mathcal{F}_ {n-1} \right]
& = \mathbb{E} \left[ e^{\lambda X_ n - (e^\lambda - 1 - \lambda) V_n} \mid \mathcal{F}_ {n-1} \right]
\\
& = \mathbb{E} \left[ e^{ \lambda X_ n} \mid \mathcal{F}_ {n-1} \right] e^{ - (e^\lambda - 1 - \lambda) V_n }
\\
& \le e^{(e^{\lambda} - 1 - \lambda) \mathbb{E}[ X_ n^2 \mid \mathcal{F}_ {n-1}]} e^{ - (e^\lambda - 1 - \lambda) V_n }
\\
& = 1
\, .
\end{aligned}
$$

Therefore, $\mathbb{E} [ M_ {n} | \mathcal{F}_ {n-1}] = M_ {n-1} \mathbb{E}[ D_ n | \mathcal{F}_ {n-1}] \le M_ {n-1}$, which shows that $\lbrace M_ n \rbrace_ {n=0}^\infty$ is a supermartingale.
By Lemma 1 with $c = \frac{1}{\delta}$, it holds that

$$
\mathbb{P} \left( \exists n \in \mathbb{N} : M_ n \ge \frac{1}{\delta} \right) \le \delta \mathbb{E} \left[ M_ 0 \right] = \delta \, .
$$

Taking the log on the both sides of $M_ n \ge \frac{1}{\delta}$ then arranging the terms, we get $\sum_ {i=1}^n X_ n \ge \frac{e^{\lambda} - 1 - \lambda}{\lambda}\sum_ {i=1}^n V_ n + \frac{1}{\lambda} \log \frac{1}{\delta}$.
The proof is complete.
$\square$

# Applications of Freedman's Inequality

Freedman's inequality implies various useful applications by choosing appropriate values of $\lambda$ or bounding the conditional variances.
The first corollary I present is a simplified version of Theorem 1, which was introduced in Beygelzimer, et al. (2011) [2] and adopted in [4, 5, 6].
Agarwal, et al (2012) [3] derive a similar result, but with much worse constants due to suboptimal analysis.

> **Corollary 1** (Freedman's Inequality in [1, 2]) Let $\lbrace X_ n \rbrace_ {n=1}^\infty$ be a m. d. s. with respect to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$.
> Suppose $|X_ n| \le 1$ holds almost surely for all $n \in \mathbb{N}$.
> Let $V_ n = \mathbb{E} [ X_ n^2 | \mathcal{F}_ {n-1} ]$ be the conditional variance of $X_ n$.
> Then, for any $\lambda \in (0, 1]$ and $\delta \in (0, 1]$, it holds that
> 
> $$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge (e - 2) \lambda \sum_ {i=1}^n V_ i + \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta \, .
> $$

*Proof* From $\lambda \in (0, 1]$, $g(\lambda) \le g(1) = e - 2$ holds by Lemma 2.
It implies that $\frac{e^\lambda - 1 - \lambda}{\lambda} \le (e - 2) \lambda$.
Plugging in this bound in the result of Theorem 1 completes the proof.
In fact, $X_ n \ge -1$ is not necessary for this one-sided bound.
$\square$

The next corollary applies Theorem 1 to nonnegative and bounded random variables, where their conditional variances are naturally bounded by their conditional means.
This corollary shows that a sum of such random variables must lie within some constant multiple of their conditional means with high probability.
Note that $\lbrace X_ n \rbrace_ {n=1}^\infty$ is not a m. d. s. here.

> **Corollary 2** (For Nonnegative R.V.s) Let $\lbrace X_ n \rbrace_ {n=1}^\infty$ be a sequence of random variables adapted to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$.
> Suppose $0 \le X_ n \le 1$ holds almost surely for all $n \in \mathbb{N}$.
> Then, for any $\lambda > 0$ and $\delta \in (0, 1]$, it holds that
> 
> $$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge \frac{ e^\lambda - 1}{\lambda} \sum_ {i=1}^n \mathbb{E} \left[ X_ i | \mathcal{F}_ {i-1} \right] + \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta
> $$
> 
> and
> 
> $$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \le \frac{ 2 \lambda - e^\lambda + 1}{\lambda} \sum_ {i=1}^n \mathbb{E} \left[ X_ i | \mathcal{F}_ {i-1} \right] - \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta \, .
> $$

*Proof* Let $Y_ n = X_ n - \mathbb{E} [ X_ n | \mathcal{F}_ {n-1} ]$.
Then, $Y_ n \in \mathcal{F}_ {n}$ and $Y_ n \le 1$ holds almost surely.
Also, $\mathbb{E} [ Y_ n | \mathcal{F}_ {n-1}] = \mathbb{E}[  X_ n - \mathbb{E} [ X_ n | \mathcal{F}_ {n-1} ] | \mathcal{F}_ {n-1} ] = \mathbb{E} [ X_ n | \mathcal{F}_ {n-1} ] - \mathbb{E} [ X_ n | \mathcal{F}_ {n-1} ] = 0$.
Therefore, $\lbrace Y_ n \rbrace_ {n=1}^\infty$ satisfies the conditions of Theorem 1 with respect to $\lbrace \mathcal{F}_ {n} \rbrace_ {n=0}^\infty$.
By Theorem 1, it holds that

$$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n Y_ i \ge \frac{e^\lambda - 1 - \lambda}{\lambda} \sum_ {i=1}^n \mathbb{E} \left[ Y_ i^2 \mid \mathcal{F}_ {i-1} \right] + \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta \, .
$$

Note that $\mathbb{E}[ Y_ n^2 | \mathcal{F}_ {n-1}]$ is the conditional variance of $Y_ n$, which is also the conditional variance of $X_ n$. Using that $0 \le X_ n \le 1$, we have that $X_ n^2 \le X_ n$, which implies that $\mathbb{E}[ Y_ n^2 | \mathcal{F}_ {n-1} ] \le \mathbb{E} [ X_ n^2 | \mathcal{F}_ {n-1} ] \le \mathbb{E} [ X_ n | \mathcal{F}_ {n-1} ]$.
Plugging in this bound and the definition of $Y_ n$ into the inequality, we get the first inequality of the corollary.
For the second inequality of the corollary, define $Y_ n = \mathbb{E}[ X_ n | \mathcal{F}_ {n-1} ] - X_ n$ instead then follow the same steps.
$\square$

A possible and useful choice of $\lambda$ for Corollary 2 is 0.75, which yields

$$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge \frac{3}{2} \sum_ {i=1}^n \mathbb{E} \left[ X_ i \mid \mathcal{F}_ {n-1} \right] + \frac{4}{3} \log \frac{1}{\delta} \right) \le \delta
\, ,
$$


$$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \le \frac{1}{2} \sum_ {i=1}^n \mathbb{E} \left[ X_ i \mid \mathcal{F}_ {n-1} \right] - \frac{4}{3} \log \frac{1}{\delta} \right) \le \delta
\, .
$$

Now, I show that Bernstein's inequality is a corollary of Freedman's inequality.
The standard statment of Bernstein's inequality assumes a sequence of independent random variables whose absolute values are bounded.
Corollary 3 only assumes a m. d. s. with upper-bounded random variables.
However, as it requires choosing $\lambda$ dependently on $n$, the inequality loses the time-uniform property.
I discuss this matter after proving the corollary.

> **Corollary 3** (Bernstein's Inequality for m. d. s.) Let $\lbrace X_ n \rbrace_ {n=1}^\infty$ be a m. d. s. with respect to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$.
> Fix $N \in \mathbb{N}$.
> Suppose $X_ n \le 1$ holds almost surely for all $n = 1, 2, \ldots, N$.
> Suppose that there exists $\sigma \ge 0$ such that $\sum_ {i=1}^N \mathbb{E} [ X_ i^2 | \mathcal{F}_ {i-1} ] \le \sigma^2 N$ a. s. .
> Then, for any $\delta \in (0, 1]$, it holds that
> 
> $$
\mathbb{P} \left( \sum_ {i=1}^N X_ i \ge \frac{1}{3} \log \frac{1}{\delta} +  \sigma \sqrt{2 N \log \frac{1}{\delta}} \right) \le \delta \, .
> $$

*Proof* We start from the result of Theorem 1.
Suppose $0 < \lambda < 3$.
Then, by Taylor expansion, it holds that

$$
g(\lambda) = \sum_ {i=0}^\infty \frac{\lambda^i}{(i+2)!} \le \sum_ {i=0}^\infty \frac{\lambda^i}{2\cdot 3^{i}} \le \frac{1}{2 (1 - \frac{\lambda}{3})} \, ,
$$

where the first inequality holds by $n! = 2 \cdot 3 \cdot \cdots \cdot n \ge 2 \cdot 3 \cdot \cdots 3 = 2 \cdot 3^{n-2}$ for $n \ge 2$ and the last inequality holds since $0 < \lambda < 3$.
Then, it holds that $\frac{e^\lambda - 1 - \lambda}{\lambda} \le \frac{\lambda}{2 (1 - \frac{\lambda}{3})}$.
Plug in this bound to the result of Theorem 1.
Additionally fixing $n = N$ and plugging in the bound $\sum_ {i=1}^N V_ i \le \sigma^2 N$, we obtain that

$$
\mathbb{P} \left( \sum_ {i=1}^N X_ i \ge \frac{\lambda}{2 ( 1 - \frac{\lambda}{3})} \cdot \sigma^2 N + \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta \, . \qquad (1)
$$

Take

$$
\lambda = \frac{ 3 \sqrt{2 \log \frac{1}{\delta}}}{ 3 \sigma \sqrt{N} + \sqrt{ 2 \log \frac{1}{\delta}}} \, .
$$

Observe that $0 < \lambda < 3$.
By plugging in this value of $\lambda$ to inequality (1) and with some calculation, we obtain the desired result.
$\square$

If $V_ n$ is constant, specifically $\sigma^2$, then Corollary 3 provides an upper bound on $\sum_ {i=1}^N X_ i$ that scales with $\sigma \sqrt{N}$ by choosing an appropriate value of $\lambda$, whereas Theorem 1 gives a bound that scales with $\sigma^2 N$ for fixed $\lambda > 0$.
However, since the value of $\lambda$ depends on $N$, Corollary 3 is no longer time-uniform.
It is possible to apply the same idea in the previous [post](/posts/TimeUniformAzuma/) to obtain a time-uniform version of Bernstein's inequality with a small cost of a constant and an additional $\log \log n$ factor.

# Time-Uniform Bernstein's Inequality

> **Theorem 2** (Time-Uniform Bernstein's Inequality) Let $\lbrace X_ n \rbrace_ {n=1}^\infty$ be a m. d. s. with respect to a filtration $\lbrace \mathcal{F}_ n \rbrace_ {n=0}^\infty$.
> Suppose $X_ n \le 1$ holds almost surely for all $n$.
> Let $V_ n = \mathbb{E} [ X_ n^2 | \mathcal{F}_ {n-1} ]$.
> Suppose that there exists $\sigma \ge 0$ such that $V_ n \le \sigma^2$ for all $n$.
> Then, for any $\delta \in (0, 1]$, it holds that
> 
> $$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge \frac{1}{3} \log \frac{7(\log 2n)^2}{2\delta} + 2^{\frac{3}{4}} \sigma \sqrt{n \log \frac{7 (\log 2n)^2}{2\delta}} \right) \le \delta \, .
> $$

*Proof* Following the steps to obtain inequality (1) in the proof of Corollary 3, we obtain that for fixed $0 < \lambda < 3$, it holds that

$$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge \frac{ \lambda \sigma^2 n }{2 ( 1 - \frac{\lambda}{3})} + \frac{1}{\lambda} \log \frac{1}{\delta} \right) \le \delta 
\, .
$$

As in the [time-uniform Azuma's inequality](/posts/TimeUniformAzuma/#time-uniform-confidence-bounds---supermartingales)'s case, partition the set of natural numbers as the following:

$$
\begin{aligned}
    I_ 0 =& \lbrace 1 \rbrace \\
    I_ 1 =& \lbrace 2, 3 \rbrace \\
    I_ 2 =& \lbrace 4, 5, 6, 7 \rbrace \\
    \vdots \\
    I_ j =& \lbrace 2^j, \ldots 2^{j+1} - 1 \rbrace 
    \vdots
\end{aligned}
$$

Fix $j \ge 0$.
By restricting $n$ to be in $I_ j$ and replacing $\delta$ with $\frac{\delta}{2(j+1)^2}$, we obtain that

$$
\mathbb{P} \left( \exists n \in I_ j : \sum_ {i=1}^n X_ i \ge \frac{ \lambda \sigma^2 n}{2 ( 1 - \frac{\lambda}{3})} + \frac{1}{\lambda} \log \frac{ 2(j+1)^2 }{\delta} \right) \le \frac{\delta}{2 (j + 1)^2}
$$

Take $\lambda_ j = \frac{ 3 \sqrt{\log \frac{2 (j+1)^2}{\delta}}}{ \sqrt{ \log \frac{2 (j+1)^2}{\delta}} + 3 \cdot 2^{\frac{2j - 1}{4}} \sigma}$.
Then,

$$
\begin{aligned}
    \frac{ \lambda_ j \sigma^2 n}{2 ( 1 - \frac{\lambda_ j}{3})} + \frac{1}{\lambda_ j} \log \frac{ 2(j+1)^2 }{\delta}
    & = \frac{1}{2} \cdot \frac{ \sigma n }{2^{\frac{2j-1}{4}}} \sqrt{ \log \frac{ 2 (j+1)^2}{\delta}} + 2^{\frac{2j-1}{4}} \sigma \sqrt{ \log \frac{ 2(j+1)^2}{\delta}} + \frac{1}{3} \log \frac{ 2(j+1)^2}{\delta}
    \\
    & = \frac{1}{3} \log \frac{ 2(j+1)^2}{\delta} + \left( \frac{ n }{2^{\frac{2j+3}{4}}} + 2^{\frac{2j-1}{4}}
    \right) \sigma \sqrt{ \log \frac{ 2(j+1)^2}{\delta}}
    \\
    & \le \frac{1}{3} \log \frac{ 2 ( j+1)^2}{\delta} + 2^{\frac{3}{4}}\sigma \sqrt{n \log \frac{ 2(j+1)^2}{\delta}}
    \, ,
\end{aligned}
$$

where the inequality uses that $\frac{n}{2} \le 2^j \le n$ for all $n \in I_ j$.
Note that $j+1 = \log_ 2 2^{j+1} \le \log_ 2 2n$.
We have that $\frac{\pi^2(j+1)^2}{6} \le \frac{ \pi^2 ( \log_ 2 2n)^2}{6} \le \frac{7(\log 2n)^2}{2}$.
Putting all together, we obtain 

$$
\mathbb{P} \left( \exists n \in I_ j : \sum_ {i=1}^n X_ i \ge \frac{1}{3} \log \frac{7(\log 2n)^2}{2\delta} + 2^{\frac{3}{4}}\sigma \sqrt{n \log \frac{7(\log 2n)^2}{2\delta}} \right) \le \frac{\delta}{2 (j + 1)^2} \, .
$$

Taking the union bound over $j = 0, 1, ...$ yields the following, which is the desired result.

$$
\mathbb{P} \left( \exists n \in \mathbb{N} : \sum_ {i=1}^n X_ i \ge \frac{1}{3} \log \frac{7(\log 2n)^2}{2\delta} + 2^{\frac{3}{4}}\sigma \sqrt{n \log \frac{7(\log 2n)^2}{2\delta}} \right) \le \delta \, .
$$

$\square$

# Conclusion

In this post, I proved a high-probability concentration inequality for upper-bounded m. d. s., which is a result follows from Freedman (1975) [10].
I also showed how Theorem 1 implies several instantiations of Freedman's inequality in bandit literature, demonstrating its strength.
Some literature use Freedman's inequality in a suboptimal way, and replacing it appropariately with Theorem 1 or one its corollaries leads to a reduction of a constant or a $\log T$ factor.
At the end, I proved time-uniform Bernstein's inequality, and I would like to note that it is my independent work.

# References

[1] Peter L. Bartlett, Varsha Dani, Thomas P. Hayes, Sham M. Kakade, Alexander Rakhlin, and Ambuj Tewari. "High-probability regret bounds for bandit online linear optimization." Proceedings of the 21st Annual Conference on Learning Theory, 2008.  
[2] Alina Beygelzimer, John Langford, Lihong Li, Lev Reyzin, and Robert E. Schapire. "Contextual bandit algorithms with supervised learning guarantees." Proceedings of the Fourteenth International Conference on Artificial Intelligence and Statistics. JMLR Workshop and Conference Proceedings, 2011.  
[3] Alekh Agarwal, Miroslav Dudík, Satyen Kale, John Langford, and Robert E. Schapire. "Contextual bandit learning with predictable rewards." Artificial Intelligence and Statistics, 2012.  
[4] Alekh Agarwal, Daniel Hsu, Satyen Kale, John Langford, Lihong Li, and Robert E. Schapire. "Taming the monster: A fast and simple algorithm for contextual bandits." International Conference on Machine Learning, 2014.    
[5] Dylan J. Foster, Alekh Agarwal, Miroslav Dudík, Haipeng Luo, and Robert E. Schapire. "Practical contextual bandits with regression oracles." International Conference on Machine Learning, 2018.     
[6] Dylan Foster and Alexander Rakhlin. "Beyond UCB: Optimal and efficient contextual bandits with regression oracles." International Conference on Machine Learning, 2020.    
[7] Yunbei Xu and Assaf Zeevi. "Upper counterfactual confidence bounds: a new optimism principle for contextual bandits." arXiv preprint arXiv:2007.07876 (2020).    
[8] Matteo Papini, Andrea Tirinzoni, Marcello Restelli, Alessandro Lazaric, and Matteo Pirotta. "Leveraging good representations in linear contextual bandits." International Conference on Machine Learning. PMLR, 2021.  
[9] Andrea Tirinzoni, Matteo Papini, Ahmed Touati, Alessandro Lazaric, and Matteo Pirotta. "Scalable representation learning in linear contextual bandits with constant regret guarantees." Advances in Neural Information Processing Systems 35 (2022): 2307-2319.  
[10] David A. Freedman. "On tail probabilities for martingales." the Annals of Probability, 1975.  
[11] Rick Durrett, "Probability: Theory and Examples", 2019.  