def func(f):
    def wrapper(*args,**kwargs):
        print("Started")
        ret = f(*args,**kwargs)
        print("Ended")
        return ret
    return wrapper

@func
def func2():
    print("I am func2")

@func
def func3(x):
    print("I am func3")
    return x*2



func2()
print(func3(5))