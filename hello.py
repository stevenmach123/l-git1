v=[3,4,5,1,2,3]
l:set[int] = set()
for i in range(4):
    if i%2 ==0 and l.__contains__(v[i]):
        l.add(v[i]*10)
print(l)