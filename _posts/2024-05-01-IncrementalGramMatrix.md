---
layout: post
title: "Some facts about incremental Gram matrices"
date: 2024-05-01 15:00
categories: 
    math
    linear-algebra
math: true
toc: false
---

While fiddling with some equations, I discovered some interesting linear algebra facts about Gram matrices.
I thought it was worth writing a post.
They are seemingly non-trivial facts with simple proofs.

By a Gram matrix, I refer to a matrix of the form $V_n=\sum_{i=1}^n x_i x_i^\top$, where $x_i \in \mathbb{R}^d$ for all $i = 1, 2, \ldots n$.
Such kind of matrices frequently arises in the analysis of linear regressions, linear bandits, etc...
I believe that in statistics, they are also called as the "design matrices" or the "covariate matrices".

Consider a situation where $U \in \mathbb{R}^{d \times d}$ is a symmetric positive definite matrix, $x \in \mathbb{R}^d$ is an arbitrary vector, and $V = U + xx^\top \in \mathbb{R}^{d \times d}$.
If $U$ is a Gram matrix with some $n$ vectors, then $V$ is a Gram matrix with $n + 1$ vectors with $x$ being the added vector, hence the title "incremental Gram matrix".

> **Fact 1** $V^{-1}x = \frac{1}{1 + \left\lVert x \right\rVert _{U^{-1}}^2 } U^{-1}x$.

This fact shows that $V^{-1}x$ and $U^{-1}x$ are scalar multiples of each other, which did not seem so trivial to me.
Note that without the inverse, $Vx$ and $Ux$ are usually *not* scalar multiples of each other.
The proof is quite straight forward.

*Proof* : 

$$
\begin{aligned}
    V^{-1} x
    & =\left( U + xx^\top \right)^{-1} x
    \\
    & = \left( U^{\frac{1}{2}} \left( I + U^{-\frac{1}{2}} x x^\top U^{-\frac{1}{2}} \right) U^{\frac{1}{2}} \right)^{-1} x
    \\
    & = U^{-\frac{1}{2}} \left( I + U^{-\frac{1}{2}} x x^\top U^{-\frac{1}{2}} \right)^{-1} U^{-\frac{1}{2}} x
    \, .
\end{aligned}
$$

Let $z = U^{-\frac{1}{2}}x$.
Then the last term is equivalent to $U^{-\frac{1}{2}} \left( I + z z^\top \right)^{-1}z$.
Note that $(I + zz^\top) z = z + z z^\top z = (1 + \left\lVert z\right\rVert _2^2) z$, which implies $\left( I + zz^\top\right)^{-1} z  = \frac{1}{1 + \left\lVert z \right\rVert _2^2 } z$.
Plugging back $z = U^{-\frac{1}{2}}x$, we have that

$$
\begin{aligned}
    V^{-1} x &= U^{-\frac{1}{2}} \left( \frac{1}{1 + \left\lVert z \right\rVert _2^2}z \right)
    \\
    & = \frac{1}{1 + \left\lVert x \right\rVert _{U^{-1}}^2} U^{-1} x
    \, .
\end{aligned}
$$

$\square$

> **Fact 2** The following equalities hold.
> 
> $$
> \begin{aligned}
    U^{-1} - V^{-1}
    & = V^{-1} x x^\top U^{-1}
    \\
    & = U^{-1} x x^\top V^{-1}
    \\
    & = \frac{1}{1 + \left\lVert x \right\rVert _{U^{-1}}^2}U^{-1} x x^\top U^{-1}
\end{aligned}
> $$

By Fact 2, $V^{-1} x x^\top U^{-1}$ must be a symmetric matrix, since $U^{-1} - V^{-1}$ is symmetric.
I do not think that it is something quite obvious at first glance.
Furthermore, Fact 2 reveals that $U^{-1} - V^{-1}$ is a positive semi-definite matrix with rank 1.
Specifically, it is $y y^\top$ where $y = \frac{U^{-1}x}{\sqrt{1 + \left\lVert x \right\rVert _{U^{-1}}^2}}$ by the last inequality.

*Proof* : 
The first equality can be shown by the following steps.

$$
\begin{aligned}
    U^{-1} - V^{-1}
    & = V^{-1} V U^{-1} - V^{-1}
    \\
    & = V^{-1} \left( V U^{-1} - I \right)
    \\
    & = V^{-1} \left( \left( U + xx^\top \right) U^{-1} - I \right)
    \\
    & = V^{-1}xx^\top U^{-1}

\end{aligned}
$$

Proving the second equality basically takes the same steps, only that the order of multiplications are reversed.
The last inequality can be shown by applying Fact 1 directly.
$\square$

**Remark**
The first and second equalities can be easily generalized to invertible matrices as follows: If $A \in \mathbb{R}^{ d \times d}$ and $B \in \mathbb{R}^{ d \times d}$ are invertible matrices, then

$$
\begin{aligned}
A^{-1} - B^{-1}
& = B^{-1} B A^{-1} - B^{-1}
\\
& = B^{-1} \left( B A^{-1} - I \right)
\\
& = B^{-1} \left( (A + (B - A)) A^{-1} - I \right)
\\
& = B^{-1} (B - A) A^{-1}
\, .
\end{aligned}
$$

and

$$
\begin{aligned}
A^{-1} - B^{-1}
& = A^{-1} B B^{-1} - B^{-1}
\\
& = \left( A^{-1} B - I \right) B^{-1}
\\
& = \left( A^{-1} (A + (B - A)) - I \right) B^{-1}
\\
& = A^{-1} (B - A) B^{-1}
\, .
\end{aligned}
$$

---
(Added Aug 12, 2024) Some time after uploading this post, I realized that Fact 2 is actually a special case of the [Sherman-Morrison Formula](https://en.wikipedia.org/wiki/Sherman%E2%80%93Morrison_formula).
I am adding this information for interested readers who would like to see a more general result, and also as a reference for myself in case I forget the name of the formula — which happens often.
