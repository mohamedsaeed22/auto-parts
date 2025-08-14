interface InformationPanelProps {
  userType: string;
}

export function InformationPanel({ userType }: InformationPanelProps) {
  return (
    <div className="mt-8 p-4 bg-logo-gold/10 rounded-lg border border-logo-gold/20">
      <h3 className="font-semibold text-logo-black mb-2 text-right">
        معلومات مهمة:
      </h3>
      <ul className="text-sm text-logo-black/80 space-y-1 text-right">
        <li>• يمكنك إضافة عدة قطع ثم إرسالها جميعاً من الجانب الأيسر</li>
        <li>• سيتم الرد على طلبك خلال 24 ساعة عمل</li>
        <li>• تأكد من إرفاق صور واضحة للقطعة والطلب والاستمارة</li>
        {userType === "workshop" && (
          <>
            <li>• رقم الهيكل يساعد في تحديد القطعة المناسبة</li>
            <li>• يمكنك تتبع طلبك من خلال رمز المستخدم</li>
          </>
        )}
        {userType === "store" && <li>• للمحلات: نقدم أسعار خاصة بالجملة</li>}
      </ul>
    </div>
  );
}
