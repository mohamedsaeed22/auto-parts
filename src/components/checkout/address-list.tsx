'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, MapPin, Plus } from 'lucide-react';
import { Address, useAddresses, useDeleteAddress } from '@/services/api/checkout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddressForm } from './address-form';
import { cn } from '@/lib/utils';

interface AddressListProps {
  selectedAddressId?: number;
  onSelect?: (address: Address) => void;
}

export function AddressList({ selectedAddressId, onSelect }: AddressListProps) {
  const { t } = useTranslation('checkout');
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address>();
  const { data: addressesResponse, isLoading, isError } = useAddresses();
  const deleteAddressMutation = useDeleteAddress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">
          {t('errors.loadingAddressesFailed')}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  const addresses = addressesResponse?.data || [];

  const handleAddressClick = (address: Address) => {
    onSelect?.(address);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleDeleteAddress = async (address: Address) => {
    if (window.confirm(t('address.confirmDelete'))) {
      await deleteAddressMutation.mutateAsync(address.id);
    }
  };

  const handleAddressFormSuccess = () => {
    setIsAddressFormOpen(false);
    setEditingAddress(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('address.title')}</h2>
        <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {t('address.add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress
                  ? t('address.editTitle')
                  : t('address.addTitle')}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSuccess={handleAddressFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      {addresses.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {t('address.noAddresses')}
        </p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                selectedAddressId === address.id && 'border-primary',
                onSelect && 'cursor-pointer hover:border-primary'
              )}
              onClick={() => onSelect && handleAddressClick(address)}
            >
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.name}</span>
                  {address.is_default && (
                    <span className="text-xs text-muted-foreground">
                      ({t('address.default')})
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.address}, {address.city}, {address.state}
                </p>
                {!onSelect && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                    >
                      {t('address.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address);
                      }}
                      disabled={deleteAddressMutation.isPending}
                    >
                      {t('address.delete')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}