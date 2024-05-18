import { ErrorMessageComponent } from "src/presentation/components/error-message/error-message-component";
import { LoadingSpinner } from "src/presentation/components/loading-spinner/loading-spinner-component";
import { FormTitleComponent } from "src/presentation/components/form-title/form-title-component";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { InputComponent } from "src/presentation/components/input/input-component";
import { StockEntity } from "src/domain/abstract/entities/stock-entity";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.scss";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";

type Props = {
  GetStockByNameUseCase: GetStockByNameUseCase;
};

export const GetOneStockPage: React.FC<Props> = ({
  GetStockByNameUseCase,
}: Props) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [stockData, setStockData] = useState<StockInfoDto>({
    simbolo: "",
    nome_da_empresa: "",
    cotacao: 0,
  });

  const handleError = (message: string) => {
    setFormError((old) => ({
      ...old,
      show: true,
      message,
    }));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      GetStockByNameUseCase.execute(id)
        .then((data) => {
          if (data instanceof Error) {
            handleError(data.message);
          } else {
            setStockData(data);
          }
        })
        .catch((error: any) => {
          handleError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="get-one-stock-page">
      <form className="form-container">
        <FormTitleComponent title="Stock" />

        <InputComponent
          label="Symbol"
          type="text"
          name="simbolo"
          value={stockData?.simbolo?.toString() || ""}
          onChange={() => {}}
          disabled={true}
        />

        {formError.show && (
          <ErrorMessageComponent message={formError.message} />
        )}
      </form>
      <LoadingSpinner loading={loading} />
    </div>
  );
};
