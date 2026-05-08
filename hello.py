v=[3,4,5,1,2,3]
l:set[int] = set()

for i in range(4):
    if i%2 !=0 or l.__contains__(v[i]):
        l.add(v[i]*100)
print(l)
print(v)