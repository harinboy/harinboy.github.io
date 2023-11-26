#include <stdio.h>

int main(void){
    int i, j, x, t;
    int cnt = 0;
    int n = 8;
    for(i = 0; i < (1 << n); i++){
        x = 0;
        t = 1;
        for(j = i; j > 0; j >>= 1){
            if((j & 1) != 0){
                x--;
            }else{
                x++;
            }
            if(x < 0 && x * x >= 4 * t){
                cnt++;
                break;
            }
            t++;
        }
    }
    printf("%d, %f\n", cnt, cnt/((float) (1 << n)));
}