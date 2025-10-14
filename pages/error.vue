<template>
    <div class="errorpage">
        <div class="content">
            <img src="@/assets/images/errorfatf.png" alt="">
            <div>
                <div style="color: #5e5c5d;font-weight: 600;">
                    因您未遵守《系統開戶者使用條款》，經審查官依《洗錢防制法》第14條展開調查，初步查出您帳戶之資金流向涉及掩飾特定犯罪所得來源、及疑似以非正常程序進行資金運送或轉換之行為，已觸犯洗錢相關法令。
                </div>
                <div>經金融監控單位報請檢察機關偵辦，檢察官依據《洗錢防制法》第15條之規定，已向管轄法院聲請於次回見期日前對該帳戶所涉及資產為：</div>
                <div>對該帳戶資產下達禁止提領、轉帳及付款命令，並強制進行專款專用處理。</div>
                <div>另依**《洗錢防制法》第16條第1項但書規定**，如有理由認為不立即為上述保全命令，將致使相關財產或證據難以保全，檢察官得逕行執行臨時保全措施，並應於執行後三日內補請法院核發正式保全命令。
                </div>
                <div>本案亦已函報相關金融單位留存紀錄，必要時得依《刑事訴訟法》進行限制出境、凍結帳戶及追查上游資金來源。</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass">
.errorpage
    background-color: #d9d9d9
    height: 100dvh
    .content
        width: 400px
        margin: 0 auto
        padding-top: 100px
        color: #000
        @media (max-width: 752px)
            width: 100%
            padding: 30px 20px
        img
            margin: 0 auto
            margin-bottom: 40px
            @media (max-width: 752px)
                width: 100px
</style>