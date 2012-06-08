var distributome = {
  nodes:[
    {nodeName:"1:_:Standard Normal", group:0}, 
    {nodeName:"2:_:General Normal", group:1},	
    {nodeName:"3:_:Chi", group:0},	
    {nodeName:"4:_:Chi-Square", group:1},	
    {nodeName:"5:_:Gamma", group:1},	
    {nodeName:"6:_:Beta", group:0},	
    {nodeName:"7:_:Student's T", group:0},	
    {nodeName:"8:_:Poisson", group:1},	
    {nodeName:"9:_:General Cauchy", group:1},	
    {nodeName:"10:_:Cauchy", group:3},	
    {nodeName:"11:_:Exponential", group:2},	
    {nodeName:"12:_:Fisher's F", group:3},	
    {nodeName:"13:_:Bernoulli", group:5},	
    {nodeName:"14:_:Binomial", group:1},	
    {nodeName:"15:_:Negative Binomial", group:1},	
    {nodeName:"16:_:Geometric", group:2},	
    {nodeName:"17:_:Erlang", group:9},	
    {nodeName:"18:_:Laplace", group:11},	
    {nodeName:"19:_:Continuous Uniform", group:8},	
    {nodeName:"20:_:Discrete Uniform", group:8},	
    {nodeName:"21:_:Logarithmic-Series", group:0},	
    {nodeName:"22:_:Logistic", group:9},	
    {nodeName:"23:_:Logistic-Exponential", group:9},	
    {nodeName:"24:_:Power-Function", group:6},	
    {nodeName:"25:_:Benford's Law", group:0},	
    {nodeName:"26:_:Pareto", group:5},	
    {nodeName:"27:_:Student's T Non-Central", group:0},	
    {nodeName:"28:_:ArcSine", group:0},	
    {nodeName:"29:_:Half Circle", group:0},	
    {nodeName:"30:_:U-Quadratic", group:0},	
    {nodeName:"31:_:Standard Uniform", group:0},	
    {nodeName:"32:_:Zipf", group:0},	
    {nodeName:"33:_:Inverted Gamma", group:0},	
    {nodeName:"34:_:Fisher-Tippett", group:0},	
    {nodeName:"35:_:Gumbel", group:0},	
    {nodeName:"36:_:Hypergeometric", group:0},	
    {nodeName:"37:_:Log-Normal", group:7},	
    {nodeName:"38:_:Gibrat's", group:0},	
    {nodeName:"39:_:Hyperbolic Secant", group:10},	
    {nodeName:"40:_:Gompertz", group:0},	
    {nodeName:"41:_:Standard Cauchy", group:3},
    {nodeName:"42:_:MultiNomial", group:0},	
    {nodeName:"43:_:NegativeMultiNomial", group:0},
    {nodeName:"44:_:Rectangular", group:11},
    {nodeName:"45:_:Beta-Binomial", group:0},
    {nodeName:"46:_:Negative Hypergeometric", group:0},
    {nodeName:"47:_:Zeta", group:0},
    {nodeName:"48:_:Logarithm", group:0},
    {nodeName:"49:_:Power Series", group:0},
    {nodeName:"50:_:Beta-Pascal", group:0},
    {nodeName:"51:_:Gamma-Poisson", group:0},
    {nodeName:"52:_:Pascal", group:1},
    {nodeName:"53:_:Polya", group:0},
    {nodeName:"54:_:Gamma-Normal", group:0},
    {nodeName:"55:_:Discrete Weibull", group:11},
    {nodeName:"56:_:Noncentral Beta", group:0},
    {nodeName:"57:_:Arctangent", group:9},
    {nodeName:"58:_:Noncentral Chi-square", group:1},
    {nodeName:"59:_:Log Gamma", group:0},
    {nodeName:"60:_:Generalized Gamma", group:0},
    {nodeName:"61:_:Inverse Gaussian", group:0},
    {nodeName:"62:_:Standard Wald", group:9},
    {nodeName:"63:_:Inverted Beta", group:0},	
    {nodeName:"64:_:Makeham", group:0},
    {nodeName:"65:_:HypoExponential", group:1},
    {nodeName:"66:_:Doubly Noncentral t", group:0},
    {nodeName:"67:_:HyperExponential", group:0},
    {nodeName:"68:_:Muth", group:0},
    {nodeName:"69:_:Error", group:9},
    {nodeName:"70:_:Minimax", group:0},
    {nodeName:"71:_:Noncentral F", group:0},
    {nodeName:"72:_:IDB", group:0},
    {nodeName:"73:_:Standard Power", group:11},
    {nodeName:"74:_:Rayleigh", group:11},
    {nodeName:"75:_:Standard Triangular", group:11},
    {nodeName:"76:_:Doubly noncentral F", group:0},
    {nodeName:"77:_:Power", group:9},
    {nodeName:"78:_:Weibull", group:5},
    {nodeName:"79:_:Log Logistic", group:9},
    {nodeName:"80:_:TSP", group:11},
    {nodeName:"81:_:Extreme Value", group:11},
    {nodeName:"82:_:Lomax", group:11},
    {nodeName:"83:_:von Mises", group:9},
    {nodeName:"84:_:Generalized Pareto", group:0},
    {nodeName:"85:_:Triangular", group:11},
    {nodeName:"86:_:Kolmogorov-Smirnov", group:11},
    {nodeName:"87:_:Exponential Power", group:11}
  ],
  links:[
	{source:1, target:0, value:2},
	{source:0, target:2, value:2},
	{source:0, target:3, value:2},
	{source:4, target:1, value:3},
	{source:4, target:10, value:1},
	{source:4, target:5, value:2},
	{source:6, target:0, value:3},
	{source:6, target:9, value:1},
	{source:9, target:8, value:2},
	{source:8, target:9, value:2},
	{source:11, target:6, value:2},
	{source:6, target:11, value:2},
	{source:12, target:13, value:2},
	{source:13, target:12, value:2},
	{source:13, target:1, value:3},
	{source:13, target:1, value:3},
	{source:14, target:15, value:1},
	{source:16, target:10, value:1},
	{source:16, target:3, value:1},
	{source:17, target:10, value:2},
	{source:10, target:17, value:1},
	{source:5, target:27, value:0},
	{source:26, target:1, value:3},
	{source:26, target:6, value:1},
	{source:25, target:10, value:2},
	{source:22, target:10, value:1},
	{source:30, target:25, value:2},
	{source:30, target:24, value:2},
	{source:30, target:10, value:3},
	{source:30, target:22, value:2},
	{source:30, target:5, value:1},
	{source:18, target:30, value:1},
	{source:31, target:19, value:1},
	{source:7, target:0, value:3},
	{source:13, target:7, value:3},
	{source:4, target:32, value:2},
	{source:33, target:34, value:1},
	{source:35, target:13, value:3},
	{source:36, target:1, value:2},
	{source:1, target:36, value:2},
	{source:36, target:37, value:1},
	{source:9, target:40, value:1},
	{source:40, target:9, value:2},
	{source:40, target:38, value:2},
	{source:41, target:13, value:2},
	{source:42, target:14, value:2},
	{source:48, target:51, value:2},
	{source:50, target:51, value:1},
	{source:7, target:50, value:4},
	{source:19, target:43, value:1},
	{source:43, target:44, value:1},
	{source:44, target:45, value:2},
	{source:31, target:46, value:3},
	{source:48, target:47, value:2},
	{source:48, target:7, value:2},
	{source:51, target:49, value:4},
	{source:51, target:7, value:3},
	{source:13, target:44, value:4},
	{source:45, target:13, value:3},
	{source:52, target:13, value:1},
	{source:51, target:15, value:1},
	{source:15, target:51, value:2},
	{source:54, target:15, value:1},
	{source:51, target:1, value:3},
	{source:1, target:0, value:1},
	{source:1, target:57, value:2},
	{source:1, target:3, value:2},
	{source:5, target:1, value:3},
	{source:1, target:53, value:1},
	{source:0, target:40, value:2},
	{source:60, target:0, value:3},
	{source:57, target:3, value:1},
	{source:4, target:58, value:2},
	{source:59, target:36, value:3},
	{source:59, target:4, value:1},
	{source:60, target:61, value:1},
	{source:60, target:3, value:2},
	{source:3, target:2, value:2},
	{source:3, target:11, value:2},
	{source:11, target:3, value:3},
	{source:10, target:3, value:2},
	{source:3, target:10, value:1},
	{source:3, target:16, value:1},
	{source:4, target:3, value:1},
	{source:5, target:30, value:1},
	{source:4, target:16, value:1},
	{source:4, target:62, value:2},
	{source:5, target:62, value:2},
	{source:9, target:56, value:1},
	{source:64, target:16, value:1},
	{source:10, target:64, value:2},
	{source:16, target:10, value:1},
	{source:63, target:39, value:1},
	{source:65, target:26, value:1},
	{source:10, target:11, value:2},
	{source:70, target:11, value:3},
	{source:10, target:66, value:1},
	{source:66, target:10, value:1},
	{source:71, target:10, value:3},
	{source:10, target:73, value:2},
	{source:77, target:10, value:1},
	{source:10, target:77, value:2},
	{source:67, target:10, value:3},
	{source:30, target:39, value:2},
	{source:30, target:86, value:2},
	{source:68, target:17, value:1},
	{source:17, target:68, value:1},
	{source:30, target:78, value:2},
	{source:30, target:75, value:2},
	{source:30, target:18, value:1},
	{source:30, target:72, value:2},
	{source:33, target:80, value:1},
	{source:72, target:30, value:1},
	{source:30, target:72, value:1},
	{source:69, target:72, value:1},
	{source:71, target:74, value:2},
	{source:76, target:72, value:1},
	{source:77, target:74, value:1},
	{source:83, target:25, value:2},
	{source:84, target:75, value:1},
	{source:77, target:80, value:2},
	{source:78, target:81, value:1},
	{source:81, target:78, value:1},
	{source:78, target:21, value:2},
	{source:79, target:84, value:1},
	{source:82, target:18, value:3},
	{source:19, target:20, value:10},
	{source:20, target:23, value:10},
	{source:23, target:27, value:10},
	{source:27, target:28, value:10},
	{source:28, target:29, value:10},
	{source:29, target:32, value:10},
	{source:32, target:53, value:10},
	{source:53, target:55, value:10},
	{source:55, target:56, value:10},
	{source:56, target:58, value:10},
	{source:58, target:62, value:10},
	{source:62, target:73, value:10},
	{source:73, target:85, value:10}
  ]
};
