# demo-saas

## 設計メモ
変更する理由ごとに場所わけ  

例えばUIを変更したい。  

「保存ボタンのデザインを変えたい」  
        ↓  
TodoEditTemplate  

Todo取得の方法を変えたい。  

「getTodoの取得方法を変えたい」  
        ↓  
useTodoEdit  

DB更新の仕様を変えたい。  

「更新時にuserIdのチェックを追加したい」  
        ↓  
updateTodo  

リダイレクト先を変えたい。  

「保存後は一覧に戻したい」  
        ↓  
updateTodo  

層	責務  
TodoEditTemplate	UIを描画する  
useTodoEdit	画面の状態・取得・フォーム送信を管理する  
updateTodo	認証・DB更新・revalidate・redirect  
Prisma	DBとやり取りする  
